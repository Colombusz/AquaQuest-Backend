import express from 'express';
import upload from '../utils/multer.js'; 

const router = express.Router();


// IMPORT ROUTES
import { login, register, verifyUser } from '../controller/user.js';

// USE ROUTES
// router.get('/login',  login);
router.post('/login',  login);
router.post('/register',  upload.array('images'), register);
router.get('/verify/:id', verifyUser); 

export default router;