import express from 'express';
import { generateUserPDF } from '../controller/pdfController.js';
import isAuthenticated from '../middleware/auth.js'

const router = express.Router();

// Route to generate and download the PDF
router.get('/download', isAuthenticated, generateUserPDF);

export default router;
