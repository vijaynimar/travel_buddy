import multer from "multer";
import path from "path";
import "dotenv/config"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename, "./uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); 
  },
});
export const profile=multer({storage:storage}).single("profile")
export const multerPhotos = multer({ storage: storage }).array("photos", 5);