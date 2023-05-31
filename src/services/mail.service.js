// import { createTransport } from "nodemailer";
// import config from '../config/config.js'

// async function sendMail(data) {

//     let transporter = createTransport({
//         service: 'gmail',
//         port: config.mailPort,
//         auth: {
//             user: config.mailUsername, // generated ethereal user
//             pass: config.passwordUsername, // generated ethereal password
//         },
//     })

//     let info = await transporter.sendMail({
//         from: `"${data.fromName}" <${data.fromEmail}>`,
//         to:`${data.toEmail.join(",")}`,
//         subject: data.subject,
//         html:data.body
//     })

//     return info
// }

// export{
//     sendMail
// }
import nodemailer from 'nodemailer'
import config from '../config/config.js'


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.mailUsername,
        pass: config.mailPassword
    }
});

// export const sendEmail = async (email) => {
//     await transporter.sendMail({
//         from: 'CoderHouse 44985<coderhouse44985@gmail.com>',
//         to: email.to,
//         subject: email.subject,
//         html: email.html,
//     });
// }