import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "ignaciolmonzon@gmail.com",
        pass: ""
        }
})

export const sendEmailChangePassword = async (email, linkChangePassword) => {
    const mailOptions = {
        from: "ignaciolmonzon@gmail.com",
        to: email,
        subject: "Recuperacion de email",
        text: 
        `
        Haz click en el siguiente enlace para cambiar tu contraseña: ${linkChangePassword}
        `,
        html:
        `
        <p>Haz click aqui para cambiar tu contraseña: </p> <button> <a href=${linkChangePassword}>Cambiar contraseña </a></button>
        `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error al enviar correro con cambio de contraseña")
        } else {
            console.log("Correo enviado correctamente", info.response)
        }
    })
}