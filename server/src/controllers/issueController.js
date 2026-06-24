import Issue from '../models/Issue.js';
import User from '../models/User.js';
import { runDeduplicationCheck } from '../services/deduplicationService.js';
import { runAISafetyCheck } from '../services/aiService.js';

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
      .populate('reporter', 'name email level')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    next(error);
  }
};

export const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reporter', 'name email level')
      .populate('history.user', 'name role');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    next(error);
  }
};

export const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, location, images } = req.body;

    // Trigger AI Safety engine (automated classification & spam checking)
    const aiAnalysisResult = await runAISafetyCheck(images?.[0], description);

    // Trigger deduplication checks
    const isDuplicate = await runDeduplicationCheck(location.coordinates, category);

    const newIssue = new Issue({
      title,
      description,
      category,
      reporter: req.user._id,
      location,
      images,
      aiAnalysis: {
        ...aiAnalysisResult,
        isDuplicate,
      },
      history: [
        {
          status: 'reported',
          comments: 'Civic report filed by citizen.',
          user: req.user._id,
        },
      ],
    });

    const saved = await newIssue.save();
    
    // Broadcast via global socket context
    const io = req.app.get('socketio');
    if (io) {
      io.emit('newIssue', saved);
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

    if (upvotedIndex > -1) {
      // Toggle off upvote
      issue.upvotes.splice(upvotedIndex, 1);
    } else {
      issue.upvotes.push(req.user._id);
    }

    issue.upvotesCount = issue.upvotes.length;
    const updated = await issue.save();

    // Broadcast update
    const io = req.app.get('socketio');
    if (io) {
      io.emit('issueUpdated', updated);
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const uploadTempImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    // Return the image URL. Using standard local file path mock if Cloudinary config isn't initialized.
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
