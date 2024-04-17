import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
    
    const token = jwt.sign({ user }, "coderhouse", {expiresIn: '12h'})
    return token
}