import cloudinary from '../config/cloudinary.js';

export const uploadToCloud = async (filePath) => {
  if (!cloudinary || !cloudinary.config().cloud_name) {
    console.warn('Cloudinary config missing. Emulating cloud upload URL.');
    return filePath; // Fallback to local url path
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'streetvoice/issues',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Failed uploading image to Cloudinary:', error.message);
    throw new Error('Image upload failed');
  }
};

export default { uploadToCloud };
