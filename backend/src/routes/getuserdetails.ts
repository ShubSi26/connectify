import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware';
import user from '../utils/db';


const router = express.Router();

router.get('/',jwtMiddleware,async(req,res)=>{
    const {user_id}= req.body;

    const response = await user.findOne({_id:user_id},{password:0});

    if(response){
        res.status(200).json({user:response});
    }
    else{
        res.status(400).json({message:'User not found'});
    }
})

export default router;