import Users from '../dao/dbManagers/users.js'
import * as usersService from '../services/users.service.js'

const usersManager = new Users()

export const getUsers = async (req, res) => {
    try {
        const result = await usersService.getAll()
        return res.status(200).send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send(error)
    }
}

export const getUserById = async (req, res) => {
    try {
        const uid = req.params.uid

        const result = await usersService.getById(uid)
        return res.status(200).send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send(error)
    }
}

export const deleteUserByEmail = async (req, res) => {
    const email = req.params.email
    try {
        const result = await usersService.deleteUser(email) 
        res.status(200).send({status: 'success', payload: result})
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send(error)
    }
}

export const gerUserByEmail = async (req, res) => {
    try {
        const uemail = req.params.uemail

        const result = await usersService.getByEmail(uemail)
        return res.status(200).send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send(error)
    }
}

export const rolHandler = async (req, res) => {
    const uid = req.params.uid

    try {
        const user = await usersService.getById(uid)

    if (user.rol == 'premium') {
        await usersService.changeRolToUser(user)
        res.status(200).send({
            status: 'success',
            result: `user ${user.first_name} ${user.last_name} changed rol to 'user'`
        })
    } else if (user.rol == 'user') {
        await usersService.changeRolToPremium(user)
        res.status(200).send({
            status: 'success',
            result: `user ${user.first_name} ${user.last_name} changed rol to 'premium'`
        })
    } else {
        res.status(400).send({
            status: 'error',
            result: `user's rol isn't premium or user`
        })
    }
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send(error)
    }

}