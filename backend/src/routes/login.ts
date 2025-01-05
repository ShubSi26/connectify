import express, { Request, Response } from 'express';
import z from 'zod';
import bcrypt from 'bcryptjs';
import user from '../utils/db';
import {createToken} from '../utils/jwt';

const router = express.Router();

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});


router.post('/', async (req: Request, res: Response) => {

    try {
       
        const { email, password } = loginSchema.parse(req.body);
        
        const userExists = await user.findOne({ email });
        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, userExists.password);
        if (!passwordMatch) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }

        const token = createToken(userExists._id.toString());
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,  
            sameSite: 'lax', 
            maxAge: 24 * 60 * 60 * 1000
          });
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        if (error instanceof z.ZodError){
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        console.error('Error occurred while finding user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
