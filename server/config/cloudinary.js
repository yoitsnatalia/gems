const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (fileBuffer, options = {}) => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                folder: 'ande-posts', // Organize uploads in a folder
                transformation: [
                { width: 1080, height: 1080, crop: 'limit' }, // Limit size
                { quality: 'auto' }, // Auto quality optimization
                { format: 'auto' } // Auto format optimization
                ],
                ...options
            },
            (error, result) => {
                if (error) {
                reject(error);
                } else {
                resolve(result);
                }
            }
            ).end(fileBuffer);
        });
    } catch (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Image deletion failed: ${error.message}`);
    }
};

module.exports = {
    cloudinary,
    uploadImage,
    deleteImage
};