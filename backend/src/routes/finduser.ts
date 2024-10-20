import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware';
import user from '../utils/db';

const router = express.Router();

router.post('/',jwtMiddleware,async(req,res)=>{

    const {email,user_id}= req.body;

    const response = await user.findOne({email},{name:1,email:1,_id:1});

    if(!response){
        res.status(400).json({message:'User not found'});
        return;
    }

    res.status(200).json({user:response});

});


export default router;