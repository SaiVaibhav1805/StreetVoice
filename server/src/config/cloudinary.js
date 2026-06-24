import { v2 as cloudinary } from 'cloudinary';

export const initCloudinary = () => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      console.log('Cloudinary storage engine configured successfully.');
    } catch (error) {
      console.error('Failed to configure Cloudinary:', error.message);
    }
  } else {
    console.warn('Cloudinary environment keys missing. Using local image mocks.');
  }
};

export default cloudinary;
