import userModel from '../dao/models/usersModel.js'
import CustomError from '../services/errors/CustomError.js';
import { incompleteLoginFields, incompleteRegisterFields, userNotFound, userOrPasswordIncorrect } from '../services/errors/info.js';
import EErrors from '../services/errors/enums.js'
import {
    generateToken,
    isValidPassword,
} from '../utils.js';
import { ForgotPassword } from '../services/users.service.js'



const register = async (req, res) => {
    res.send({
        status: 'success',
        message: 'user Registered'
    })
}

const failRegister = async (req, res) => {
    throw CustomError.createError({
        name: 'Register failed',
        cause: incompleteRegisterFields(first_name, last_name, email, age),
        message: 'Error intentado registrarse',
        code: EErrors.REGISTER_FAILED
    })
    res.send({
        status: 'error',
        message: 'register failed'
    })
}

const login = async (req, res) => {
    const {
        email,
        password
    } = req.body

    
    try {
        if(!email || !password || !email.includes('@gmail.com') || email.trim() == "" || password.trim() == "") {
            throw CustomError.createError({
                name: 'Login failed',
                cause: incompleteLoginFields(email, password),
                message: 'Error intentado loguearse',
                code: EErrors.LOGIN_FAILED
            })
        }
        const user = await userModel.findOne({
            email: email
        })

        if (!user) {
            throw CustomError.createError({
                name: 'User not found',
                cause: userNotFound(user),
                message: 'Error intentado loguearse',
                code: EErrors.USER_NOT_FOUND
            })
        }

        if (!isValidPassword(user, password)) throw CustomError.createError({
            name: 'Login auth failed',
            cause: userOrPasswordIncorrect(),
            message: 'Error intentado loguearse',
            code: EErrors.LOGIN_AUTH_ERROR
        })

        const accessToken = generateToken(user)

        res.cookie('cookieToken', accessToken, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            })
            .send({
                status: 'success',
                message: 'login success'
            });
    } catch (error) {
        req.logger.fatal(error)
        res.status(400).send({
            error: error
        })
    }
}

// const forgotPassword = async (req, res) => {
//     const email = req.body.email
//     if(email == "") {
//         req.logger.error("Email is required")
//         res.status(400).json({"error": "Email is required"})
//     }
//     try {
// 		//services
// 		let userExist = await usersManager.getByEmail(email)
// 		if(userExist.length > 0) {
// 			let user = userExist[0]
// 			const userEmail = user.email
// 			req.logger.debug(user)
// 			try {
	
// 		const data = {
// 			"fromEmail": process.env.APP_FROM_EMAIL,
// 			"fromName": process.env.APP_FROM_NAME,
// 			"subject": "Reset Password",
// 			"body": ``,
// 			"toEmail": [user.email]
// 			}
// 			req.logger.debug(data)
	
// 			let resetPassword = new ResetPassword()
	
// 			let token = createHash(user.email)

// 			let result = resetPassword.create([{
// 				"user_id": user.id,
// 				"token": token
// 			}])

// 			let actionUrl = `http://localhost:8080/api/sessions/reset/${token}`
// 			req.logger.debug(actionUrl)

// 			const templateStr = fs.readFileSync(path.resolve(__dirname, '../views/mails/resetPassword.hbs')).toString('utf8')
//             const template = Handlebars.compile(templateStr, { noEscape: true })

// 			const html = template(
// 				{
// 					"name": `${user.first_name} ${user.last_name}`,
// 					"action_url": actionUrl
// 				}
// 			)
// 			data.body = html

// 			let resultMail = await sendMail(data)
// 			req.logger.debug(resultMail)
// 			} catch (error) {
// 				req.logger.fatal(error)
// 				res.status(500).send(error)
// 			}
// 		} else {
// 			req.logger.error(error)
// 			res.status(500).send(error)
// 		}
// 		//services

// }

const forgotPasswordHandler = async (req, res) => {
	const email = req.body.email
	if(email == ""){
		req.logger.error("Email is required")
		res.status(400).send({error: "Email is required"})
		return
	}
	try {
		let user = await ForgotPassword(email)
		req.logger.info("Password reset mail sent, please check your mail.")
		res.status(200).send("Password reset mail sent, please check your mail.")
	} catch (error) {
        console.log(error)
		req.logger.fatal(error)
		res.status(500).send(error)
	}
}

const logout = async (req, res) => {
    res.clearCookie('cookieToken')
    res.redirect('/login')
}

const current = async (req, res) => {
    res.status(200).send({
        status: 'success',
        payload: req.user
    })
}

const github = async (req, res) => {
    res.send({
        status: 'success',
        message: 'user registered'
    })
}

const githubCallback = async (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
}

export {
    register,
    failRegister,
    login,
    logout,
    current,
    github,
    githubCallback,
	forgotPasswordHandler
}