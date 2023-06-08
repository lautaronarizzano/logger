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
