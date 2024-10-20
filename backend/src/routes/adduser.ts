import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware';
import user from '../utils/db';

const router = express.Router();

router.post('/',jwtMiddleware,async(req,res)=> {

    const {email,user_id}= req.body;

    const response = await user.findOne({email},{password:0});

    if(!response){
        res.status(400).json({message:'User not found'});
        return;
    }

    const isalreadyfriend = await user.findOne({_id:user_id},{contacts:1});

    if(isalreadyfriend && isalreadyfriend.contacts !== null){

        for (let contact of isalreadyfriend.contacts) {
            if (contact.email === response.email) {
                res.status(200).json({ message: 'User already in contacts' });
                return;
            }
        }
    }
    
    const addcontact = await user.updateOne({_id:user_id},{$push:{contacts:{userId:response._id, name:response.name, email:response.email}}});

    if(addcontact){
        res.status(200).json({message:'User added to contacts'});
    }
    else{
        res.status(400).json({message:'User not added to contacts'});
    }


})

export default router;