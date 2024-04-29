import jwt from 'jsonwebtoken'
import varenv  from '../varenv.js';

export const generateToken = (user) => {
    
    const token = jwt.sign({ user }, "coderhouse", {expiresIn: '12h'})
    return token
}