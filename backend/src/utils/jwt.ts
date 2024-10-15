import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const secret: string = process.env.SECRET_KEY || 'fgjjjgjghj';

const createToken = (id: string) => {
    return jwt.sign({ id }, secret, { expiresIn: '1h' });
};

const verifyToken = (token: string) => {
    return jwt.verify(token, secret);
};

export { createToken, verifyToken };