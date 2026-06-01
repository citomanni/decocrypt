const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an in-memory file buffer (from multer) to Cloudinary.
const uploadFromBuffer = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(file.buffer).pipe(stream);
  });

// Remove a previously uploaded asset by its public id.
const deleteImage = async (publicId) => {
  if (publicId) await cloudinary.uploader.destroy(publicId);
};

module.exports = cloudinary;
module.exports.uploadFromBuffer = uploadFromBuffer;
module.exports.deleteImage = deleteImage;
