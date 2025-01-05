import express from 'express';
import z from 'zod';
import bcrypt from 'bcryptjs';
import user from '../utils/db';


const router = express.Router();

const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

router.post('/', async (req, res) => {
    const {name, email, password } = registerSchema.parse(req.body);

    try {
        const userExists = await user.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.create({ name, email, password: hashedPassword });
        res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error occurred while creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;