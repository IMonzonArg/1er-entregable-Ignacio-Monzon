import { userModel } from "../models/user.js";

export const getUsers = async (req, res) => {}
try{
    const users = await userModel.find()
    res.status(200).send(users)
} catch(e){
    req.logger.error(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
    res.status(500).send(`Error al consultar users: ${e.message}`);

}