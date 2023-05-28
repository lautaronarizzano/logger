import { createTransport } from "nodemailer";
import config from '../config/config.js'

async function sendMail(data) {

    let transporter = createTransport({
        service: config.mailHost,
        port: config.mailPort,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.mailUsername, // generated ethereal user
            pass: config.passwordUsername, // generated ethereal password
        },
    })

    let info = await transporter.sendMail({
        from: `"${data.fromName}" <${data.fromEmail}>`,
        to:`${data.toEmail.join(",")}`,
        subject: data.subject,
        html:data.body
    })

    return info
}

export{
    sendMail
}