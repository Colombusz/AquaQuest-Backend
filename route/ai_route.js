import express from 'express';
import { getAIresponse } from '../controller/ai_controller.js';


const router = express.Router();

router.post('/ai', getAIresponse);
export default router;