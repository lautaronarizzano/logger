import Router from 'express'
import { rolHandler, getUsers, getUserById, deleteUserByEmail } from '../../controllers/users.controller.js'

const router = Router()

router.get('/', getUsers)

router.get('/:uid', getUserById)

router.get('/email/:uemail')

router.get('/premium/:uid', rolHandler)

router.delete('/:email', deleteUserByEmail)

export default router