
import Users from '../dao/dbManagers/users.js' 
import { sendMail } from './mail.service.js';
import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'
// import ResetPassword from '../dao/models/resetPasswordModel.js'
import __dirname, { createHash } from '../utils.js';
import config from '../config/config.js'

const usersManager = new Users()

export async function ForgotPassword(email) {
    let userExist = await usersManager.getByEmail(email)
    // console.log(userExist)
    if (true) {
        let user = userExist;
        const userEmail = user.email;
        console.log(user)
        try {

            // creating data for sending mail
            const data = {
                "fromEmail": config.fromEmail,
                "fromName": config.fromName,
                "subject": "Reset Password",
                "body": ``,
                "toEmail": [user.email]
            }
            console.log(data)

            //initializing ResetPassword() model for storing user_id and token in the database.
            // let resetPassword = new ResetPassword();

            // creating token 
            let token = createHash(user.email)

            // storing user_id and token in `reset_password` table
            let result = usersManager.saveNewPassword([{
                "user_id": user._id,
                "token": token
            }])

            // creating redirect url for navigating user to fill new password
            let actionUrl = `http://localhost:8080/api/sessions/reset/${token}`;
            console.log(actionUrl)

            // reading template file for sending in mail
            const templateStr = fs.readFileSync(path.resolve(__dirname, './views/resetPassword.handlebars')).toString('utf8')
            const template = Handlebars.compile(templateStr, { noEscape: true })

            // parsing template file for changing variables with values

            const html = template(
                {
                    "name": `${user.first_name} ${user.last_name}`,
                    "action_url": actionUrl

                }
            )
            data.body = html;

            // sending mail using nodemailer library
            let resultMail = await sendMail(data);
            console.log(resultMail)

        } catch (error) {
            console.log(error);
            throw new Error("Something wrong in sending mail");
        }

    } else {
        throw new Error("User not found with that email")
    }

}