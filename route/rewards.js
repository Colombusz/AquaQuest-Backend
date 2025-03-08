import express from 'express';
const router = express.Router();
import { getRewards, claimReward } from '../controller/rewardsController';

router.get('/getRewards/:id', getRewards);
router.post('/claimReward/:id', claimReward);

export default router;