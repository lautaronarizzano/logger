import userModel from '../dao/models/usersModel.js'
import CustomError from '../services/errors/CustomError.js';
import { incompleteLoginFields, incompleteRegisterFields, userNotFound, userOrPasswordIncorrect } from '../services/errors/info.js';
import EErrors from '../services/errors/enums.js'
import Session from '../dao/dbManagers/session.js'
import {
    decodeToken,
    generateToken,
    isValidPassword,
} from '../utils/utils.js';
import Users from '../dao/dbManagers/users.js'
import { sendEmailResetPassword } from '../services/session.service.js';

const sessionManager = new Session()
const usersManager = new Users()

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

const forgotPasswordHandler = async (req, res) => {
	const {email} = req.body
	if(email == "" || !email){
		req.logger.error("Email is required")
		res.status(400).send({error: "Email is required"})
		return
	}
    const user = await usersManager.getByEmail(email)
    if(!user) {
        req.logger.error('email not found')
        res.status(400).send({error: "email not found in DB"})
    }
	try {
		const token = await sessionManager.getAccountToken(email)
        if (token) {

            await sendEmailResetPassword(email, token)
            req.logger.info("Password reset mail sent, please check your mail.")
            return res.status(200).send("Password reset mail sent, please check your mail.")
        } else {
            req.logger.error('Los datos ingresados no existen')
            return res.status(500).send({ status: 'error', message: 'Los datos ingresados no existen' })
        }
	} catch (error) {
        console.log(error)
		req.logger.fatal(error)
		res.status(500).send(error)
	}
}

const changePassword = async (req, res) => {
    const token = req.params.token
    const { passwordNew } = req.body
    let result = decodeToken(token)

    if(!result) return res.status(401).send({ status: 'error', message: 'Invalid token. Token has expired, please try again' })

    const resp = await sessionManager.changePassword(result.user.email, passwordNew)

    console.log(resp)

    if(!resp || resp == null) return res.status(401).send({ status: 'error', message: 'No puede ingresar la misma contraseña que ya tenia antes.' })

    return res.send({ message: 'success' })
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
	forgotPasswordHandler,
    changePassword
}