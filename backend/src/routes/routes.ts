import express from 'express';

import login from './login';
import register from './register';
import getuserdetails from './getuserdetails';
import finduser from './adduser';
import getcontacts from './getcontacts';
import find from './finduser';

const router = express.Router();

router.use('/login', login);
router.use('/register', register);
router.use('/getuserdetails', getuserdetails);
router.use('/adduser', finduser);
router.use('/getcontacts', getcontacts);
router.use('/finduser', find);

export default router;