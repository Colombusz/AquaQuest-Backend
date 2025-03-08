import express from 'express';
import isAuthenticated from '../middleware/auth.js';
import { getMonthlyConsumption, getMonthlyCost, getPredictedConsumption, getPredictedCost, getWaterSavingTips, savePredictedData, getMonthlyPredictedCost, getMonthlyPredictedConsumption} from '../controller/chartAnalytics.js';

const router = express.Router();

router.post('/save-prediction', isAuthenticated, savePredictedData);
router.get('/monthly-cost', isAuthenticated, getMonthlyCost);
router.get('/monthly-consumption', isAuthenticated, getMonthlyConsumption);
router.get('/predicted-cost', isAuthenticated, getPredictedCost);
router.get('/predicted-consumption', isAuthenticated, getPredictedConsumption);
router.get("/water-saving-tips", isAuthenticated, getWaterSavingTips);
router.get('/predicted-monthly-cost', isAuthenticated, getMonthlyPredictedCost);
router.get('/predicted-monthly-consumption', isAuthenticated, getMonthlyPredictedConsumption);

export default router;

