import {
    Router
} from 'express'
import {
    register,
    login,
    products,
    carts,
    resetPassword,
    changePassword
} from '../../controllers/views.controller.js'
import { authenticateToken  } from '../../utils/utils.js'

const router = Router()

const publicAccess = (req, res, next) => {
    if (req.cookies['cookieToken']) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.cookies['cookieToken']) return res.redirect('/login');
    next();
}

router.get('/register', publicAccess, register)

router.get('/login', publicAccess, login)

router.get('/reset-password', publicAccess, resetPassword)

router.get('/change-password', publicAccess, changePassword)

router.get('/products', authenticateToken, privateAccess, products)

router.get('/carts/:cid', carts)

export default router