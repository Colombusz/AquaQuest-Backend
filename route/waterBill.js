import express from 'express';
import upload from '../utils/multer.js'; 
import isAuthenticated from '../middleware/auth.js';

const router = express.Router();

import { extractBillDetails, uploadAndAnalyze, getAllBills } from '../controller/waterBill.js'

router.post('/upload', isAuthenticated, upload.array('imageUrl'), uploadAndAnalyze);
router.get('/bills',  isAuthenticated, getAllBills);


export default router;