import Issue from '../models/Issue.js';
import User from '../models/User.js';
import { runDeduplicationCheck, findNearbyDuplicate } from '../services/deduplicationService.js';
import { runAISafetyCheck } from '../services/aiService.js';
import { uploadImage } from '../services/imageService.js';

export const getIssues = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const issues = await Issue.find(query)
      .populate('reportedBy', 'name email level')
      .sort({ createdAt: -1 });

    res.json({ success: true, issues });
  } catch (error) {
    next(error);
  }
};

export const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email level ward')
      .populate('assignedTo', 'name');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json({ success: true, issue });
  } catch (error) {
    next(error);
  }
};

export const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, severity, latitude, longitude, address, ward } = req.body;

    if (!title || !category || !latitude || !longitude) {
      return res.status(400).json({ message: 'Title, category, latitude, and longitude are required' });
    }

    const parsedLat = parseFloat(latitude);
    const parsedLng = parseFloat(longitude);

    // 1. Upload image to Cloudinary (fallback to mock if keys are not configured/fails)
    let media = [];
    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.buffer, req.file.mimetype);
        media.push({
          url: uploadResult.url,
          cloudinaryId: uploadResult.cloudinaryId,
          type: 'image'
        });
      } catch (err) {
        console.warn('Cloudinary upload failed, falling back to mock:', err.message);
        media.push({
          url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600',
          cloudinaryId: 'mock_cloudinary_id',
          type: 'image'
        });
      }
    } else {
      // Fallback placeholder if no image file was sent
      media.push({
        url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600',
        cloudinaryId: 'mock_cloudinary_id',
        type: 'image'
      });
    }

    // 2. Trigger AI safety analysis
    const aiAnalysisResult = await runAISafetyCheck(media[0].url, description || '');

    // 3. Check for duplicates
    const duplicate = await findNearbyDuplicate(parsedLng, parsedLat, category);

    if (duplicate) {
      // Add upvote to the duplicate issue instead of creating a new ticket
      const userIdStr = req.user._id.toString();
      const hasUpvoted = duplicate.upvotes.some((u) => u.toString() === userIdStr);
      if (!hasUpvoted) {
        duplicate.upvotes.push(req.user._id);
        duplicate.upvoteCount = duplicate.upvotes.length;
        await duplicate.save();
      }

      // Add to user stats
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 5 } });

      const io = req.app.get('io');
      if (io) {
        io.emit('issue_updated', { issueId: duplicate._id, status: duplicate.status });
      }

      return res.status(201).json({
        ...duplicate.toObject(),
        isDuplicate: true
      });
    }

    // 4. Create new issue
    const newIssue = new Issue({
      title,
      description: description || '',
      category,
      severity: severity || 'medium',
      reportedBy: req.user._id,
      location: {
        type: 'Point',
        coordinates: [parsedLng, parsedLat],
        address: address || '',
        ward: ward || ''
      },
      media,
      aiAnalysis: {
        ...aiAnalysisResult,
        isDuplicate: false,
      }
    });

    const saved = await newIssue.save();

    // Increment user report count and add XP (+10 XP for new report)
    await User.findByIdAndUpdate(req.user._id, { $inc: { issuesReported: 1, xp: 10 } });

    // Broadcast via global socket context
    const io = req.app.get('io');
    if (io) {
      io.emit('new_issue', saved);
    }

    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

export const upvoteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const userIdStr = req.user._id.toString();
    const upvotedIndex = issue.upvotes.findIndex((u) => u.toString() === userIdStr);

    let upvoted = false;
    if (upvotedIndex > -1) {
      // Toggle off upvote
      issue.upvotes.splice(upvotedIndex, 1);
    } else {
      issue.upvotes.push(req.user._id);
      upvoted = true;
    }

    issue.upvoteCount = issue.upvotes.length;
    const updated = await issue.save();

    // Broadcast update
    const io = req.app.get('io');
    if (io) {
      io.emit('issue_updated', { issueId: updated._id, status: updated.status });
    }

    res.json({ success: true, upvoted, upvoteCount: updated.upvoteCount });
  } catch (error) {
    next(error);
  }
};

export const uploadTempImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const fileUrl = req.file.path || `/uploads/${req.file.filename}`;
    res.json({ imageUrl: fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

export default {
  getIssues,
  getIssueById,
  createIssue,
  upvoteIssue,
  uploadTempImage,
};
