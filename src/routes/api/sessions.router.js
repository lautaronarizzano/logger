import {
    Router
} from 'express'
import passport from 'passport';
import { register,
    failRegister,
    login,
    logout,
    current,
    github,
    githubCallback } from '../../controllers/sessions.controller.js'

const router = Router()


router.post('/register', passport.authenticate('register', {
    failureRedirect: 'fail-register'
}), register)

router.get('/fail-register', failRegister)

router.post('/login', login);

router.get('/logout', logout)

router.get('/current', passport.authenticate("current", {
    session: false
}), current)

router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}), github)

router.get('/github-callback', passport.authenticate('github', {
    failureRedirect: '/login'
}), githubCallback)

export default router