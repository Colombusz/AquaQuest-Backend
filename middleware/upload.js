import multer from 'multer';

const storage = multer.diskStorage({});
const uploadA = multer({ storage });

export default uploadA;
