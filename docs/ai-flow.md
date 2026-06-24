# AI Diagnostics Data Pipeline Flow

This document outlines the pipeline flow when citizens upload evidence photos.

## Step-by-Step AI Pipeline

1. **Trigger**: User uploads photo in `PhotoUpload.jsx`.
2. **CDN Upload**: Frontend calls `uploadService.js`. Backend saves image to temporary uploads folder (and pushes to Cloudinary in production).
3. **Spam & Content Classification**: 
   - Backend calls `aiService.js` sending the image URL.
   - LLM evaluates context against `spamDetection.txt` and `categorizeIssue.txt` system templates.
   - If spam score is greater than 0.5, the issue is marked as `rejected`.
4. **Severity Matrix Rating**:
   - Evaluates image and description against `severityAssessment.txt`.
   - Returns estimated severity level (`Low`, `Medium`, `High`, `Critical`).
5. **Deduplication Check**:
   - Runs `deduplicationService.js` checking coordinates within 100 meters.
   - Flags possible duplicates to avoid duplicate municipal repair dispatch tickets.
6. **Form Autofill**:
   - Category and severity feedback are shown in `AIAnalysisCard.jsx` to help citizens fill forms quickly.
