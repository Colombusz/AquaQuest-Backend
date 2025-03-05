import express from 'express';
import { CreateStatFile, GetStatFile} from '../controller/gamestatController.js';
const router = express.Router();


router.post('/createStatFiles/:id', CreateStatFile);
router.get('/getStatFiles/:id', GetStatFile);
export default router;