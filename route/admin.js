import express from 'express';
import { getTotalUsers, getTotalWaterBills, getTotalWaterBillsPerMonth, getWaterBillCategories, getWaterConsumptionTrend, getAllUsers, adminLogin, adminLogout, getPlayerEngagement } from '../controller/adminController.js';
import { isAdmin } from "../middleware/auth.js";
const router = express.Router();

router.get('/total-users', async (req, res) => {
    try {
        const totalUsers = await getTotalUsers();
        res.status(200).json({ totalUsers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get("/player-engagement", getPlayerEngagement);
router.get("/total-waterbills", getTotalWaterBills);
router.get("/total-waterbills-monthly", getTotalWaterBillsPerMonth);
router.get("/water-bill-categories", getWaterBillCategories);
router.get("/water-consumption-trend", getWaterConsumptionTrend);
router.get("/get-all-users", getAllUsers);
router.post("/admin-login", adminLogin);
router.post("/admin-logout", adminLogout)
router.get("/check-auth", isAdmin, (req, res) => {
    res.json({ role: "admin" });
});

export default router;