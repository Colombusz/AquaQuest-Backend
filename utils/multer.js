// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({});

// const upload = multer({
//     limits: { fieldSize: 50 * 1024 * 1024 },
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         console.log(req.files);
//         let ext = path.extname(file.originalname).toLowerCase();
//         if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//             cb(new Error("Unsupported file type!"), false);
//             return;
//         }
//         cb(null, true);
//     },
// });

// export default upload;


// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// // Get directory path for storing uploads
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../uploads')); // Save files to 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
//     }
// });

// const upload = multer({
//     limits: { fileSize: 50 * 1024 * 1024 },
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         console.log("File received:", file);
//         let ext = path.extname(file.originalname).toLowerCase();
//         if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//             return cb(new Error("Unsupported file type!"), false);
//         }
//         cb(null, true);
//     },
// });

// export default upload;


import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get directory path for storing uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Save files to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});

const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 },
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log("File received:", file);
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            return cb(new Error("Unsupported file type!"), false);
        }
        cb(null, true);
    },
});

export default upload;