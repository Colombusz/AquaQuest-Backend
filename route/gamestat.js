import express from 'express';
import { CreateStatFile, GetStatFile, getLeaderboard} from '../controller/gamestatController.js';
const router = express.Router();


router.post('/createStatFiles/:id', CreateStatFile);
router.get('/getStatFiles/:id', GetStatFile);
router.get("/leaderboard", getLeaderboard);

export default router;