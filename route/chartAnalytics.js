import express from 'express';
import isAuthenticated from '../middleware/auth.js';
import { getMonthlyConsumption, getMonthlyCost, getPredictedConsumption, getPredictedCost } from '../controller/chartAnalytics.js';

const router = express.Router();

router.get('/monthly-cost', isAuthenticated, getMonthlyCost);
router.get('/monthly-consumption', isAuthenticated, getMonthlyConsumption);
router.get('/predicted-cost', isAuthenticated, getPredictedCost);
router.get('/predicted-consumption', isAuthenticated, getPredictedConsumption);

export default router;
