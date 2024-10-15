import  {verifyToken}  from '../utils/jwt';
import { Request, Response, NextFunction } from 'express';

const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        verifyToken(token);
        next();
    } catch (error) {
        console.error('Error occurred while verifying token:', error);
        res.status(401).send('Unauthorized');
    }
};

export default jwtMiddleware;