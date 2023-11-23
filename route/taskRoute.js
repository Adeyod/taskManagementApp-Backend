import express from 'express';
import {
  createTask,
  updateTask,
  getUserTask,
  getUserTasks,
  deleteTask,
} from '../controller/taskController.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/user/createTask', verifyToken, createTask);
router.put('/user/updateTask/:id', verifyToken, updateTask);
router.get('/user/task/', verifyToken, getUserTasks);
router.get('/user/task/:id', verifyToken, getUserTask);
router.delete('/user/deleteTask/:id', verifyToken, deleteTask);

export default router;
