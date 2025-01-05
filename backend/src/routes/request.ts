import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware';
import user from '../utils/db';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/incoming', jwtMiddleware, async(req,res)=>{
    
    const {user_id} = req.body;

    const response = await user.findOne({_id:user_id},{incomingRequests:1});

    if(!response){
        res.status(400).json({message:'User not found'});
        return;
    }

    res.status(200).json({contacts:response.incomingRequests});
});

router.get('/outgoing', jwtMiddleware, async(req,res)=>{
    
    const {user_id} = req.body;

    const response = await user.findOne({_id:user_id},{outgoingRequests:1});

    if(!response){
        res.status(400).json({message:'User not found'});
        return;
    }

    res.status(200).json({contacts:response.outgoingRequests});
});

router.post('/accept',jwtMiddleware,async(req,res)=>{
    
    const {user_id,contact_id} = req.body;

    console.log(user_id,contact_id);

    const response = await user.findOne({_id:user_id},{incomingRequests:1,name:1,email:1});

    if(!response){
        res.status(400).json({message:'User not found'});
        return;
    }


    const contact = response.incomingRequests.find((contact:any)=>contact.id.equals(contact_id));

    if(!contact){
        res.status(400).json({message:'Contact not found'});
        return;
    }

    const addcontact = await user.updateOne({_id:user_id},{$push:{contacts:{userId:contact.id, name:contact.name, email:contact.email}}});

    if(!addcontact){
        res.status(400).json({message:'Contact not added'});
        return;
    }

    const removeRequest = await user.updateOne({_id:user_id},{$pull:{incomingRequests:{id:contact_id}}});
    const removesenderrequest = await user.updateOne({_id:contact_id},{$pull:{outgoingRequests:{id:user_id}}});
    const updatesendercontact = await user.updateOne({_id:contact_id},{$push:{contacts:{userId:user_id, name:response.name, email:response.email}}});

    if(!removeRequest || !removesenderrequest){
        res.status(400).json({message:'Request not removed'});
        return;
    }

    res.status(200).json({message:'Contact added successfully'});

});

router.post('/send',jwtMiddleware,async(req,res)=>{

    const {user_id,contact_id} = req.body;

    const sender = await user.findOne({_id:user_id},{name:1,email:1});
    const receiver = await user.findOne({_id:contact_id},{name:1,email:1});

    if(!sender || !receiver){
        res.status(400).json({message:'User not found'});
        return;
    }

    const response = await user.updateOne({_id:user_id},{$push:{outgoingRequests:{id:contact_id,name:receiver.name,email:receiver.email}}});
    const response2 = await user.updateOne({_id:contact_id},{$push:{incomingRequests:{id:user_id,name:sender.name,email:sender.email}}});

    if(!response || !response2){
        res.status(400).json({message:'Request not sent'});
        return;
    }

    res.status(200).json({message:'Request sent successfully'});

});

router.post('/cancle',jwtMiddleware,async(req,res)=>{
    
    const {user_id,contact_id} = req.body;

    const response = await user.updateOne({_id:user_id},{$pull:{outgoingRequests:{id:contact_id}}});
    const response2 = await user.updateOne({_id:contact_id},{$pull:{incomingRequests:{id:user_id}}});

    if(!response || !response2){
        res.status(400).json({message:'Request not removed'});
        return;
    }

    res.status(200).json({message:'Request removed successfully'});

});

router.post('/reject',jwtMiddleware,async(req,res)=>{
    
    const {user_id,contact_id} = req.body;

    const response = await user.updateOne({_id:contact_id},{$pull:{outgoingRequests:{id:user_id}}});
    const response2 = await user.updateOne({_id:user_id},{$pull:{incomingRequests:{id:contact_id}}});

    if(!response || !response2){
        res.status(400).json({message:'Request not removed'});
        return;
    }

    res.status(200).json({message:'Request removed successfully'});

});

export default router;