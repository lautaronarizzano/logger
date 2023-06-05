import passport from 'passport'
import local from 'passport-local'
import userModel from '../dao/models/usersModel.js'
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt';
import {
    createHash
} from '../utils/utils.js';
import UserDto from '../dao/DTOs/current.dto.js'
import {
    createCart
} from '../controllers/carts.controller.js'
import {
    cartsModel
} from '../dao/models/cartsModel.js'
import config from './config.js';
import CustomError from '../services/errors/CustomError.js'
import { incompleteRegisterFields } from '../services/errors/info.js'
import EErrors from '../services/errors/enums.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {
            first_name,
            last_name,
            email,
            age,
            rol
        } = req.body

        
        try {
            const user = await userModel.findOne({
                email: username
            })

            if (user) {
                req.logger.error('El usuario ya existe')
                return done(null, false)
            }

            // const cart = await cartsModel.create({products: [], user: user})


            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                // rol: email.includes('admin') && password.includes('admin') ? 'admin' : 'user',
                rol: rol,
                carts: await cartsModel.create({
                    products: [],
                    user: email
                })
            }

            const result = await userModel.create(newUser)
            return done(null, result)

        } catch (error) {
            req.logger.fatal(`Error al registrar usuario ${error}`)
            return done(`Error al registrar usuario ${error}`)
        }
    }))

    // passport.use('login', new LocalStrategy({
    //     usernameField: 'email'
    // }, async (username, password, done) => {
    //     try {
    //         const user = await userModel.findOne({ email: username });

    //         if (!user) {
    //             return done(null, false)
    //         }

    //         if (!isValidPassword(user, password)) return done(null, false)

    //         return done(null, user)
    //     } catch (error) {
    //         return done(`Error al loguear usuario ${error}`);
    //     }
    // }));

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.ba34f0efaca32293',
        clientSecret: 'b448d53f77e5a41d36e3f459adfae5fd2329da78',
        callbackURL: 'http://localhost:8080/api/auth/github-callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({
                email: profile._json.email
            })
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    name: profile._json.name,
                    age: 18,
                    email: profile._json.email,
                    password: '',
                    rol: 'user'
                }

                const result = await userModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            req.logger.fatal(error)
            done(error)
        }
    }))

    const JWTStrategy = jwt.Strategy;
    const ExtractJWT = jwt.ExtractJwt;

    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['cookieToken'];
        }
        return token;
    }

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.privateKey
    }, async (jwt_payload, done) => {
        try {
            const userDto = new UserDto(jwt_payload.user)
            return done(null, userDto);
        } catch (error) {
            req.logger.fatal(error)
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user)
    })

}

export default initializePassport