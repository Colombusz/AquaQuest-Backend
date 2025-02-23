import express from 'express';

const router = express.Router();

import { getPrediction } from '../controller/predictiveAnalysis.js';

router.post('/predict', getPrediction);

export default router;