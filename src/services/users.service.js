import { Users } from "../dao/factory.js";
import UsersRepository from "../repository/users.repository.js";
import {transporter as sendEmail} from "./mail.service.js";
import __mainDirname, {
} from "../utils/utils.js"
import {
    createMailHtml
} from "../utils/customHtml.js";

const users = new Users();
const usersRepository = new UsersRepository(users)

export const getAll = async () => {
    const result = await usersRepository.getAll()
    return result
}

export const getByEmail = async (uemail) => {
    const result = await usersRepository.getByEmail(uemail)
    return result
}

export const getById = async (uid) => {
    const result = await usersRepository.getById(uid)
    return result
}

export const deleteUser = async (email) => {
    const result = await usersRepository.delete(email)
    return result
}

export const changeRolToUser = async (user) => {
    user.rol = 'user'
    const result = await usersRepository.updateById(user._id, user)
    return result
}

export const changeRolToPremium = async (user) => {
    user.rol = 'premium'
    const result = await usersRepository.updateById(user._id, user)
    return result
}

export async function ForgotPassword(email) {
    let userExist = await usersRepository.getByEmail(email);

    if (userExist) {
        let user = userExist;
        console.log(user);
        try {
            const email = {
                to: user.email,
                subject: "Reset Password",
                html: createMailHtml
            }

            await sendEmail(email)
            console.log(email)
        } catch (error) {
            console.log(error)
        }
    }
}