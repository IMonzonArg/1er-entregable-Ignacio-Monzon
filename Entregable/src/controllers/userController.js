import { userModel } from "../models/user.js";

export const getUsers = async (req, res) => {}
try{
    const users = await userModel.find()
    res.status(200).send(users)
} catch(e){
    req.logger.error(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
    res.status(500).send(`Error al consultar users: ${e.message}`);

}

export const sendDocuments = async (req,res) => {
    try {
        const {uid} = req.params
        const newDocs = req.body
        const user = await userModel.findByIdAndUpdate(uid, {
            $push: {
                documents: {
                    $each: newDocs
                } 
            }
        }, {new: true })
        if (!user) {
            res.status(404).send("User no existe")
        } else{
            res.status(200).send(e)
        }
    }catch(e) {
        res.status(500).send(e)
    }
}

export const imageProds = (req,res) => {
    
}