import jwt from 'jsonwebtoken';
import varenv from '../dotenv.js';

export const generateToken = (user) => {
    const token = jwt.sign({ user }, varenv.jwt_secret, { expiresIn: '12h' });
    return token;
};
