import express from 'express';
import { CreateStatFile } from '../controller/gamestatController.js';
const router = express.Router();


router.post('/createStatFiles/:id', CreateStatFile);
export default router;