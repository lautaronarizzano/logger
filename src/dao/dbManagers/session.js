import { createHash, generateToken, isValidPassword } from "../../utils/utils.js";
import Users from "../dbManagers/users.js";
import usersModel from "../models/usersModel.js";

const usersManager = new Users()

export default class Sessions {
    
    constructor(){}

    getAccountToken = async(email) => {
        const user = await usersManager.getByEmail(email)
        if(!user) return null
        const newUser = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            rol: user.rol
        }

        const token = generateToken(newUser)
        return token
    }

    changePassword = async (email, newPassword) => {
        const user = await usersManager.getByEmail(email)

        if(!user) return null

        if(isValidPassword(user, newPassword)) return null

        const password = createHash(newPassword)
        user.password = password
        const resp = await usersModel.updateOne({email}, user)
        return resp
    }
}