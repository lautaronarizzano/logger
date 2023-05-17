import userModel from '../dao/models/usersModel.js'
import CustomError from '../services/errors/CustomError.js';
import { incompleteLoginFields, incompleteRegisterFields, userNotFound, userOrPasswordIncorrect } from '../services/errors/info.js';
import EErrors from '../services/errors/enums.js'

import {
    generateToken,
    isValidPassword
} from '../utils.js';


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
    githubCallback
}