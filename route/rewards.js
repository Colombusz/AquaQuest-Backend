import express from 'express';
import { getRewards, claimReward } from '../controller/rewardsController.js';

const router = express.Router();

router.get('/getRewards/:id', getRewards);
router.post('/claimReward/:id', claimReward);

export default router;