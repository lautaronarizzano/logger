import Users from '../dao/dbManagers/users.js'
import * as usersService from '../services/users.service.js'

const usersManager = new Users()

export const getUsers = async (req, res) => {
    const result = await usersService.getAll()
    return res.status(200).send({status: 'success', payload: result})
}

export const getUserById = async (req, res) => {
    const uid = req.params.uid

    const result = await usersService.getById(uid)
    return res.status(200).send({status: 'success', payload: result})
}

export const rolHandler = async (req, res) => {
    const uid = req.params.uid

    const user = await usersService.getById(uid)

    if(user.rol == 'premium') {
        await usersService.changeRolToUser(user)
        res.status(200).send({status: 'success', result:`user ${user.first_name} ${user.last_name} changed rol to 'user'`})
    } else if (user.rol == 'user') {
        await usersService.changeRolToPremium(user)
        res.status(200).send({status: 'success', result:`user ${user.first_name} ${user.last_name} changed rol to 'premium'`})
    } else {
        res.status(400).send({status: 'error', result: `user's rol isn't premium or user`})
    }

}