import Users from '../dao/dbManagers/users.js'

const usersManager = new Users()

export const getUsers = async (req, res) => {
    const result = await usersManager.getAll()
    return res.status(200).send({status: 'success', payload: result})
}

export const getUserById = async (req, res) => {
    const uid = req.params.uid

    const result = await usersManager.getById(uid)
    return res.status(200).send({status: 'success', payload: result})
}

export const rolHandler = async (req, res) => {
    const uid = req.params.uid

    const user = await usersManager.getById(uid)

    if(user.rol == 'premium') {
        user.rol = 'user'
        await usersManager.updateById(user._id, user)
        res.status(200).send({status: 'success', result:`user ${user.first_name} ${user.last_name} changed rol to 'user'`})
    } else if (user.rol == 'user') {
        user.rol = 'premium'
        await usersManager.updateById(user._id, user)
        res.status(200).send({status: 'success', result:`user ${user.first_name} ${user.last_name} changed rol to premium`})
    } else {
        res.status(400).send({status: 'error', result: `user's rol isn't premium or user`})
    }

}