const cloudinary = require('../config/cloudinary');

const uploadImage = async (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'streetvoice/issues',
        resource_type: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          url: result.secure_url,
          cloudinaryId: result.public_id
        });
      }
    );
    stream.end(fileBuffer);
  });
};

const deleteImage = async (cloudinaryId) => {
  try {
    await cloudinary.uploader.destroy(cloudinaryId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

module.exports = { uploadImage, deleteImage };