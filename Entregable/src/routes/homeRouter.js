import { Router } from 'express';
import { home } from '../controllers/homeController.js';

const router = Router();

router.get('/', (req, res, next) => {
    console.log("Home route accessed");
    next();
}, home);

export default router;
