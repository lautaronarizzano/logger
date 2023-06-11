import usersModel from '../models/usersModel.js'
import ResetPassword from '../models/resetPasswordModel.js'

export default class Users {
    constructor() {
        console.log('Working users with DB in mongoDB')
    }

    getAll = async () => {
        const users = await usersModel.find()
        return users.map(user => user.toObject())
    }

    getAllPaginated = async (limit, page) => {
        const usersPaginated = await usersModel.aggregatePaginate({}, { limit, page })
        return usersPaginated
    }

    save = async (user) => {
        const result = await usersModel.create(user)
        return result
    }

    getById = async (id) => {
        const user = await usersModel.findOne({ _id: id })
        return user.toObject()
    }

    getByEmail = async (email) => {
        const user = await usersModel.findOne({email: email})
        return user
    }

    updateById = async (id, user) => {
        const result = await usersModel.updateOne({ _id: id }, user)
        return result
    }

    saveNewPassword = async (newUser) => {
        const result = await ResetPassword.create(newUser)
        return result
    }

    delete = async (email) => {
        const result = await usersModel.deleteOne({ email: email })
        return result
    }
}