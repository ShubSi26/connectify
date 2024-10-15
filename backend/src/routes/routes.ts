import express from 'express';

import login from './login';
import register from './register';

const router = express.Router();

router.use('/login', login);
router.use('/register', register);

export default router;