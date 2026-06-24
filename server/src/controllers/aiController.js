import { runAISafetyCheck } from '../services/aiService.js';

export const analyzeImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'imageUrl is required' });
    }
    const result = await runAISafetyCheck(imageUrl, 'Inspect image detail contents');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default { analyzeImage };
