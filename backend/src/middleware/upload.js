import multer from "multer";
const storage = multer.memoryStorage();
export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024, files: 5 }, fileFilter: (_req, file, callback) => /^(image\/|application\/pdf)/.test(file.mimetype) ? callback(null, true) : callback(new Error("Only images and PDFs are allowed")) });
export const filesToMetadata = (files = []) => files.map((file) => ({ filename: file.originalname, url: `pending-ipfs-upload://${file.originalname}` }));
