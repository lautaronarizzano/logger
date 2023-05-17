import mongoose from "mongoose"
import config from '../../config/config.js'

export let Users

const persistence = config.persistence

const mongoUrl = config.mongoUrl

switch (persistence) {
    case "MONGO":
        console.log("Usando DAO de mongo")
        await mongoose.connect(mongoUrl)

    const { default: UsersMongo } = await import('../dbManagers/users.js')
    Users = UsersMongo
        break
    case "FILE":
        console.log('Usando DAO de file')
        // const { default: UsersFile } = await import('./fileManagers/UsersManager.js')
        // Users = UsersFile
        break
        }

        export default Users