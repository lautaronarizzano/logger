import Router from 'express'
import { rolHandler, getUsers, getUserById } from '../../controllers/users.controller.js'

const router = Router()

router.get('/', getUsers)

router.get('/:uid', getUserById)

router.get('/premium/:uid', rolHandler)

export default router