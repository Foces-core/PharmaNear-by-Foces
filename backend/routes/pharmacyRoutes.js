import express from 'express'
import rateLimit from 'express-rate-limit'
import { AuthMiddleware } from '../middleware/authMiddleware.js'
import {
    signup,
    login,
    getProfile,
    getDetails,
    updateProfile,
} from '../controllers/pharmacyController.js'

const router = express.Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: { message: "Too many login/signup attempts, please try again later." }
});

router.post('/signup',authLimiter,signup);
router.post('/login',authLimiter,login);
router.get('/profile',AuthMiddleware,getProfile);
router.get('/details',getDetails);
router.put('/profile',AuthMiddleware,updateProfile);

export default router;