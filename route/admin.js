// import express from 'express';
// import { getPredictionAccuracy, getPlayerKillStats, getTotalMoneySavedOverTime, getTotalSavedCost, getAvgSavingsPerUser, getAverageConsumption, getUserWaterBills, updateUserStatus, getTotalUsers, getTotalWaterBills, getTotalWaterBillsPerMonth, getWaterBillCategories, getWaterConsumptionTrend, getAllUsers, adminLogin, adminLogout, getPlayerEngagement } from '../controller/adminController.js';
// import { isAdmin } from "../middleware/auth.js";
// const router = express.Router();

// router.get('/total-users', async (req, res) => {
//     try {
//         const totalUsers = await getTotalUsers();
//         res.status(200).json({ totalUsers });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// });

// router.get("/player-engagement", getPlayerEngagement);
// router.get("/total-waterbills", getTotalWaterBills);
// router.get("/total-waterbills-monthly", getTotalWaterBillsPerMonth);
// router.get("/water-bill-categories", getWaterBillCategories);
// router.get("/water-consumption-trend", getWaterConsumptionTrend);
// router.get("/get-all-users", getAllUsers);
// router.post("/admin-login", adminLogin);
// router.post("/admin-logout", adminLogout)
// router.get("/check-auth", isAdmin, (req, res) => {
//     res.json({ role: "admin" });
// });
// router.put("/update-status/:userId", updateUserStatus);
// router.get("/user-water-bills/:userId", getUserWaterBills);
// router.get("/average-consumption", getAverageConsumption)
// router.get("/total-saved-cost", getTotalSavedCost);
// router.get('/avg-savings-per-user', getAvgSavingsPerUser);
// router.get('/total-money-saved-over-time', getTotalMoneySavedOverTime);
// router.get("/kills", getPlayerKillStats); 
// router.get("/prediction-accuracy", getPredictionAccuracy); 

// export default router;

import express from 'express';
import { isAdmin } from "../middleware/auth.js";
import { adminLogin, adminLogout } from '../controller/admin/authController.js';
import { getPredictionAccuracy } from '../controller/admin/predictionController.js';
import { getPlayerKillStats, getTotalMoneySavedOverTime, getTotalSavedCost, getAvgSavingsPerUser, getTotalWoins, getTotalRelics, getTotalPotions, getPlayerInventoryList, getPlayerInventoryStats, getWoinsDistribution  } from '../controller/admin/statsController.js';
import { updateUserStatus, getTotalUsers, getAllUsers, getPlayerEngagement } from '../controller/admin/userController.js';
import { getTotalWaterBills, getTotalWaterBillsPerMonth, getWaterBillCategories, getWaterConsumptionTrend, getAverageConsumption, getUserWaterBills } from '../controller/admin/waterBillController.js';

const router = express.Router();

router.get('/total-users', async (req, res) => {
    try {
        const totalUsers = await getTotalUsers();
        res.status(200).json({ totalUsers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


router.get("/inventory-stats", getPlayerInventoryStats);  
router.get("/woins-distribution", getWoinsDistribution); 

router.get("/total-woins", getTotalWoins);
router.get("/total-relics", getTotalRelics);
router.get("/total-potions", getTotalPotions);

router.get("/player-inventory", getPlayerInventoryList);

router.get("/player-engagement", getPlayerEngagement);
router.get("/total-waterbills", getTotalWaterBills);
router.get("/total-waterbills-monthly", getTotalWaterBillsPerMonth);
router.get("/water-bill-categories", getWaterBillCategories);
router.get("/water-consumption-trend", getWaterConsumptionTrend);
router.get("/get-all-users", getAllUsers);
router.post("/admin-login", adminLogin);
router.post("/admin-logout", adminLogout);
router.get("/check-auth", isAdmin, (req, res) => {
    res.json({ role: "admin" });
});
router.put("/update-status/:userId", updateUserStatus);
router.get("/user-water-bills/:userId", getUserWaterBills);
router.get("/average-consumption", getAverageConsumption);
router.get("/total-saved-cost", getTotalSavedCost);
router.get('/avg-savings-per-user', getAvgSavingsPerUser);
router.get('/total-money-saved-over-time', getTotalMoneySavedOverTime);
router.get("/kills", getPlayerKillStats);
router.get("/prediction-accuracy", getPredictionAccuracy);

export default router;