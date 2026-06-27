const { geminiModel } = require('../config/vertexai');

// Analyze issue image and return category, severity, summary
const analyzeIssueImage = async (imageBase64, mimeType = 'image/jpeg', description = '') => {
    try {
        const prompt = `
You are an AI assistant for a civic issue reporting platform called StreetVoice.
Analyze this image of a community/infrastructure issue and return a JSON response.

User description: "${description}"

Return ONLY a valid JSON object with these exact fields:
{
  "category": one of ["pothole", "water_leakage", "streetlight", "garbage", "sewage", "road_damage", "encroachment", "other"],
  "severity": one of ["low", "medium", "high", "critical"],
  "title": "short title for the issue (max 8 words)",
  "summary": "plain language description of what you see (2-3 sentences)",
  "isValidIssue": true or false (false if image is irrelevant/spam),
  "confidence": a number between 0 and 1
}
`;

        const request = {
            contents: [{
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            mimeType,
                            data: imageBase64
                        }
                    },
                    { text: prompt }
                ]
            }]
        };

        const result = await geminiModel.generateContent(request);
        const response = result.response;
        const text = response.candidates[0].content.parts[0].text;

        // Strip markdown fences if present
        const clean = text.replace(/```json|```/g, '').trim();
        return JSON.parse(clean);

    } catch (error) {
        console.error('Gemini analysis error:', error);
        // Fallback if AI fails
        return {
            category: 'other',
            severity: 'medium',
            title: 'Community Issue',
            summary: description || 'Issue reported by citizen.',
            isValidIssue: true,
            confidence: 0
        };
    }
};

// Generate predictive insight from historical issue data
const generateInsight = async (issueStats) => {
    try {
        const prompt = `
You are a civic data analyst. Based on the following community issue statistics, 
generate 3 actionable insights for local authorities.

Data: ${JSON.stringify(issueStats)}

Return ONLY a valid JSON array of 3 insight objects:
[
  {
    "title": "short insight title",
    "description": "2 sentence explanation",
    "priority": one of ["low", "medium", "high"],
    "category": affected category
  }
]
`;

        const request = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        };

        const result = await geminiModel.generateContent(request);
        const text = result.response.candidates[0].content.parts[0].text;
        const clean = text.replace(/```json|```/g, '').trim();
        return JSON.parse(clean);

    } catch (error) {
        console.error('Gemini insight error:', error);
        return [];
    }
};

module.exports = { analyzeIssueImage, generateInsight };