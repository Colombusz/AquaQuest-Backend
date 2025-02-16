import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({});

const upload = multer({
    limits: { fieldSize: 50 * 1024 * 1024 },
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log(req.files);
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("Unsupported file type!"), false);
            return;
        }
        cb(null, true);
    },
});

export default upload;