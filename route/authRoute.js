import express from 'express';
import {
  registerUser,
  loginUser,
  verifyUser,
  userLogout,
} from '../controller/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', userLogout);
router.get('/:id/confirm/:token', verifyUser);

export default router;
