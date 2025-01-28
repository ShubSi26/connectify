import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware';
import user from '../utils/db';
import z from 'zod';

const findUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    user_id: z.string()
});

const router = express.Router();

router.post('/',jwtMiddleware,async(req,res)=>{

    try{
        const {email,user_id}= findUserSchema.parse(req.body);

        const response = await user.findOne({email},{name:1,email:1,_id:1});

        if(!response){
            res.status(400).json({message:'User not found'});
            return;
        }

        res.status(200).json({user:response});
    }catch(error){
        if (error instanceof z.ZodError){
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        console.error('Error occurred while finding user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;