import bcrypt from 'bcrypt';
import varenv from '../config/dotenv.js';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(varenv.SALT));

export const validatePassword = (passwordSend, passwordBdd) => bcrypt.compareSync(passwordSend, passwordBdd);
