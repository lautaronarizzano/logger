import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT,
    privateKey: process.env.PRIVATE_KEY,
    mongoUrl: process.env.MONGO_URL,
    persistence: process.env.PERSISTENCE,
    enviroment: process.env.NODE_ENV,
    fromEmail: process.env.APP_FROM_EMAIL,
    fromName: process.env.APP_FROM_NAME,
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUsername: process.env.MAIL_USERNAME,
    mailPassword: process.env.MAIL_PASSWORD

}