import mongoose from "mongoose"
import config from '../../config/config.js'

export let Carts

const persistence = config.persistence

const mongoUrl = config.mongoUrl

switch (persistence) {
    case "MONGO":
        console.log("Usando DAO de mongo")
        await mongoose.connect(mongoUrl)
    const { default: CartsMongo } = await import('../dbManagers/carts.js')
    Carts = CartsMongo
        break
    case "FILE":
        console.log('Usando DAO de file')
        const { default: CartsFile } = await import('../fileManagers/CartsManager.js')
        Carts = CartsFile
        break
        }

        export default Carts