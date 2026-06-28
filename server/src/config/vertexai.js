import { VertexAI } from '@google-cloud/vertexai';

const project = process.env.GOOGLE_PROJECT_ID || 'streetvoice-project';
const location = process.env.GOOGLE_LOCATION || 'us-central1';

const vertexAI = new VertexAI({ project, location });

export const geminiModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

export default { geminiModel };
