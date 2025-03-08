import express from 'express';
import isAuthenticated from '../middleware/auth.js';
import {savePredictedVsActual, getMonthlySaved } from '../controller/save.js';

const router = express.Router();

router.post('/save-waterbill', isAuthenticated, savePredictedVsActual);
router.get('/save-cost', isAuthenticated, getMonthlySaved);



export default router;