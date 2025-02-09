import express from 'express';
import { login } from '../controller/login_controller.js';

const router = express.Router();


router.get('/',  login);

export default router;