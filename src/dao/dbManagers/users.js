import { usersModel } from '../models/usersModel.js'

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

    updateById = async (id, user) => {
        const result = await userModel.updateOne({ _id: id }, user)
        return result
    }
}