import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOADS_FOLDER = "./uploads";
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

export const upload = multer({ storage });
