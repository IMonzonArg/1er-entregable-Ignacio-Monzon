import bcrypt from 'bcrypt'
import varenv from '../dotenv.js'

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(varenv.salt));

export const validatePassword = (passwordSend, passwordBdd) => bcrypt.compareSync(passwordSend, passwordBdd)