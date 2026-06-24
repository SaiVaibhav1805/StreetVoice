import Issue from '../models/Issue.js';
import Verification from '../models/Verification.js';
import User from '../models/User.js';
import { checkAndAwardGamification } from '../services/gamificationService.js';

export const submitVerification = async (req, res, next) => {
  try {
    const { status, comments, coordinates } = req.body;
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user already verified this issue
    const alreadyVerified = issue.verifications.some(
      (v) => v.user.toString() === req.user._id.toString()
    );
    if (alreadyVerified) {
      return res.status(400).json({ message: 'You have already verified this issue.' });
    }

    // Check distance between verification submitting position and issue pinned position
    let isGPSTrusted = false;
    if (coordinates && issue.location && issue.location.coordinates) {
      const [issueLng, issueLat] = issue.location.coordinates;
      const [verLng, verLat] = coordinates;

      // Simple haversine approximation
      const R = 6371; // km
      const dLat = ((verLat - issueLat) * Math.PI) / 180;
      const dLon = ((verLng - issueLng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((issueLat * Math.PI) / 180) *
          Math.cos((verLat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance <= 0.2) {
        // Within 200m range
        isGPSTrusted = true;
      }
    }

    // Save Verification entry
    const verification = await Verification.create({
      issue: issueId,
      user: req.user._id,
      status,
      comments,
      coordinates,
      isGPSTrusted,
    });

    // Update Issue Verification lists
    issue.verifications.push({
      user: req.user._id,
      status,
      comments,
    });
    issue.verificationsCount = issue.verifications.length;

    // Auto-promote status to verified if counts threshold is met
    if (issue.verificationsCount >= 3 && issue.status === 'pending') {
      issue.status = 'verified';
      issue.history.push({
        status: 'verified',
        comments: 'Auto-promoted to verified status by community consensus.',
        user: req.user._id,
      });
    }

    const savedIssue = await issue.save();

    // Award XP and achievements
    await checkAndAwardGamification(req.user._id, 'verify');

    // Broadcast update
    const io = req.app.get('socketio');
    if (io) {
      io.emit('issueUpdated', savedIssue);
    }

    res.status(201).json(savedIssue);
  } catch (error) {
    next(error);
  }
};

export const getVerificationsForIssue = async (req, res, next) => {
  try {
    const verifications = await Verification.find({ issue: req.params.issueId })
      .populate('user', 'name role level');
    res.json(verifications);
  } catch (error) {
    next(error);
  }
};

export default { submitVerification, getVerificationsForIssue };
