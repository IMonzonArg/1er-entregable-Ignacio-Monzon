import { userModel } from "../models/user.js";
import { sendEmailChangePassword } from "../utils/nodemailer.js";
import jwt from 'jsonwebtoken';
import { validatePassword, createHash } from "../utils/bcrypt.js";

export const login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("Usuario o contraseña no válidos");
        }
        
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        };

        res.status(200).send("Inicio de sesión correcto");

    } catch (e) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send("Error al iniciar sesión");
    }
}

export const register = async (req, res) => {
    try {
        if (req.user) {
            return res.status(400).send("Usuario ya existente");
        }
        res.status(200).redirect('/login'); 
    } catch (e) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error al registrar el usuario`);
    }
};

export const logout = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.session.user.email });
        if (user) {
            user.last_connection = new Date();
            await user.save();
        }
        req.session.destroy(function (e) {
            if (e) {
                req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
                res.status(500).send("Error al cerrar sesión");
            } else {
                res.status(200).redirect("/");
            }
        });
    } catch (e) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send("Error al cerrar sesión");
    }
}

export const sessionGithub = async (req, res) => {
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    };
    res.redirect('/');
}

export const testJWT = async (req, res) => {
    if (req.user.rol === 'User') {
        res.status(403).send('Usuario no autorizado');
    } else {
        res.status(200).send("");
    }
}

export const changePassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const validateToken = jwt.verify(token.slice(7), "coder");  
        const user = await userModel.findOne({ email: validateToken.userEmail });

        if (user) {
            if (await validatePassword(newPassword, user.password)) {  
                return res.status(400).send("La contraseña no puede ser igual a la anterior");
            }
            const hashPassword = createHash(newPassword);
            user.password = hashPassword;
            await userModel.findByIdAndUpdate(user._id, user);
            res.status(200).send("Contraseña modificada correctamente");
        } else {
            res.status(400).send("Usuario no encontrado");
        }
    } catch (e) {
        if (e?.message === 'jwt expired') {
            return res.status(400).send("Pasó el tiempo máximo para recuperar la contraseña, se enviará otro mail para restablecer la contraseña");
        }
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(e);
    }
}

export const sendEmailPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email: email });  
        
        if (user) {
            const token = jwt.sign({ userEmail: email }, "coder", { expiresIn: '1m' });
            const resetLink = `http://localhost:8000/api/session/reset-password?token=${token}`;
            sendEmailChangePassword(email, resetLink);  
            res.status(200).send("Email enviado correctamente");
        } else {
            res.status(400).send("Usuario no encontrado");
        }
    } catch (e) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(e);
    }
}
