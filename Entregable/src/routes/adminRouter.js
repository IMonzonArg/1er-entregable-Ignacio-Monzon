import express from 'express';
import { getUsers, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/admin', getUsers);
router.delete('/users/:id', deleteUser);
export default router;
