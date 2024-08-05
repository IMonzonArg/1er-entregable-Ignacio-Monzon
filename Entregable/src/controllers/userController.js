import { userModel } from "../models/user.js";
import { sendEmailChangePassword } from "../utils/nodemailer.js"; 

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'name email role'); 
        res.status(200).send(users);
    } catch (e) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error al consultar usuarios: ${e.message}`);
    }
};

export const deleteInactiveUsers = async (req, res) => {
    try {
        const thresholdDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); 
        const inactiveUsers = await userModel.find({ lastConnection: { $lt: thresholdDate } });

        const emails = inactiveUsers.map(user => user.email); 

        await userModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });

        emails.forEach(email => {
            sendEmailChangePassword(email, 'Cuenta eliminada por inactividad', 'Tu cuenta ha sido eliminada debido a la inactividad.');
        });

        res.json({ message: 'Usuarios inactivos eliminados y notificados por correo' });
    } catch (error) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error al eliminar usuarios inactivos: ${error.message}`);
    }
};

export const sendDocuments = async (req, res) => {
    try {
        const { uid } = req.params;
        const newDocs = req.body;
        const user = await userModel.findByIdAndUpdate(uid, {
            $push: {
                documents: {
                    $each: newDocs
                }
            }
        }, { new: true });
        
        if (!user) {
            res.status(404).send("Usuario no existe");
        } else {
            res.status(200).send(user);
        }
    } catch (e) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error al enviar documentos: ${e.message}`);
    }
};
