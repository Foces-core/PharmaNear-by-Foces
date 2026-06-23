import express from 'express';
import { searchDrugs } from '../controllers/drugController.js';

const router = express.Router()

router.get('/',searchDrugs);

export default router;