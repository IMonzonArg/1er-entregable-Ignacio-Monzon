import nodemailer from 'nodemailer';
import varenv from '../config/dotenv.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: varenv.EMAIL_USER,
        pass: varenv.EMAIL_PASS
    }
});

export const sendEmailChangePassword = async (email, linkChangePassword) => {
    const mailOptions = {
        from: 'ignaciolmonzon@gmail.com',
        to: email,
        subject: 'Recuperación de contraseña',
        text: `
        Haz click en el siguiente enlace para cambiar tu contraseña: ${linkChangePassword}
        `,
        html: `
        <p>Haz click aquí para cambiar tu contraseña: </p>
        <button><a href="${linkChangePassword}">Cambiar contraseña</a></button>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo con cambio de contraseña:', error);
        } else {
            console.log('Correo enviado correctamente:', info.response);
        }
    });
};
