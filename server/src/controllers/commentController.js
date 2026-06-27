const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const User = require('../models/User');

// POST /api/issues/:id/comments
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text?.trim()) {
            return res.status(400).json({ success: false, message: 'Comment text is required' });
        }

        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue not found' });
        }

        const isAuthority = ['authority', 'moderator'].includes(req.user.role);

        const comment = await Comment.create({
            issue: req.params.id,
            author: req.user.userId,
            text: text.trim(),
            isAuthorityUpdate: isAuthority
        });

        await comment.populate('author', 'name ward role');

        // Increment comment count
        await Issue.findByIdAndUpdate(req.params.id, {
            $inc: { commentCount: 1 }
        });

        // Award XP for commenting
        await User.findByIdAndUpdate(req.user.userId, {
            $inc: { xp: 2 }
        });

        // Emit to anyone viewing this issue
        const io = req.app.get('io');
        io.to(req.params.id).emit('new_comment', comment);

        res.status(201).json({ success: true, comment });

    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ success: false, message: 'Failed to add comment' });
    }
};

// GET /api/issues/:id/comments
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ issue: req.params.id })
            .populate('author', 'name ward role')
            .sort({ createdAt: 1 }); // oldest first

        res.status(200).json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch comments' });
    }
};

// DELETE /api/issues/:id/comments/:commentId
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Only author or moderator can delete
        const isMod = ['authority', 'moderator'].includes(req.user.role);
        if (comment.author.toString() !== req.user.userId && !isMod) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await comment.deleteOne();
        await Issue.findByIdAndUpdate(req.params.id, { $inc: { commentCount: -1 } });

        res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete comment' });
    }
};

module.exports = { addComment, getComments, deleteComment };