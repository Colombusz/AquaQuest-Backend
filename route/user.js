import express from 'express';
import upload from '../utils/multer.js'; 
import isAuthenticated from '../middleware/auth.js'

const router = express.Router();


// IMPORT ROUTES
import { login, register, verifyUser, getUserProfile, updateUserProfile } from '../controller/user.js';

// USE ROUTES
// router.get('/login',  login);
router.post('/login',  login);
router.post('/register',  upload.array('images'), register);
router.get('/verify/:id', verifyUser); 
router.get('/profile',isAuthenticated, getUserProfile); 
router.post('/update', isAuthenticated, upload.single('images'), updateUserProfile);

export default router;