const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

function createUpload() {
  const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (_req, file) =>
      new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) return reject(err);
          const filename = `${buf.toString('hex')}${path.extname(file.originalname)}`;
          resolve({ filename, bucketName: 'uploads' });
        });
      }),
  });

  return multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8MB cap for now
  });
}

module.exports = { createUpload };
