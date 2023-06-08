import mongoose from "mongoose"
import config from '../config/config.js'

export let Users
export let Products
export let Carts

const persistence = config.persistence

const mongoUrl = config.mongoUrl

switch (persistence) {
    case "MONGO":
        console.log("Usando DAO de mongo")
        await mongoose.connect(mongoUrl)
    const { default: ProductsMongo } = await import('./dbManagers/products.js')
    const { default: CartsMongo } = await import('./dbManagers/carts.js')
    const { default: UsersMongo } = await import('./dbManagers/users.js')
    Products = ProductsMongo
    Carts = CartsMongo
    Users = UsersMongo
        break
    case "FILE":
        console.log('Usando DAO de file')
        const { default: ProductsFile } = await import('./fileManagers/ProductManager.js')
        const { default: CartsFile } = await import('./fileManagers/CartsManager.js')
        Products = ProductsFile
        Carts = CartsFile
        break
        }