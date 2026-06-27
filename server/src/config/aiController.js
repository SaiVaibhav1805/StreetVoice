const { analyzeIssueImage } = require('../services/aiService');

const analyzeImage = async (req, res) => {
    try {
        const { imageBase64, mimeType, description } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ success: false, message: 'Image data required' });
        }

        const analysis = await analyzeIssueImage(imageBase64, mimeType, description);

        if (!analysis.isValidIssue) {
            return res.status(400).json({
                success: false,
                message: 'Image does not appear to show a civic issue'
            });
        }

        res.status(200).json({ success: true, analysis });

    } catch (error) {
        res.status(500).json({ success: false, message: 'AI analysis failed' });
    }
};

module.exports = { analyzeImage };