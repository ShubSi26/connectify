import  {verifyToken}  from '../utils/jwt';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        verifyToken(token);
        const decoded = jwt.decode(token);

        if (decoded && typeof decoded !== 'string' && decoded.id) {
            req.body.user_id = decoded.id;
        } else {
            throw new Error('Invalid token payload');
        }
        next();
    } catch (error) {
        console.error('Error occurred while verifying token:', error);
        res.status(401).send('Unauthorized');
    }
};

export default jwtMiddleware;