import { Router } from 'express'
import { authorizeRol, authenticateToken } from '../../utils/utils.js'

const router = Router()

router.get('/', authenticateToken, authorizeRol('user'), (req, res) => {
    res.render('chat2')
})

export default router;