import express from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware.js';
import {
    addStock,
    getStock,
    updateStock,
    deleteStock,
} from '../controllers/stockController.js';

const router = express.Router();

router.post('/',AuthMiddleware,addStock);
router.get('/',AuthMiddleware,getStock);
router.patch('/',AuthMiddleware,updateStock);
router.delete('/',AuthMiddleware,deleteStock)

export default router;