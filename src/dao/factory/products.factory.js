import mongoose from "mongoose"
import config from '../../config/config.js'

export let Products

const persistence = config.persistence

const mongoUrl = config.mongoUrl

switch (persistence) {
    case "MONGO":
        console.log("Usando DAO de mongo")
        await mongoose.connect(mongoUrl)
    const { default: ProductsMongo } = await import('../dbManagers/products.js')
    Products = ProductsMongo
        break
    case "FILE":
        console.log('Usando DAO de file')
        const { default: ProductsFile } = await import('../fileManagers/ProductManager.js')

        Products = ProductsFile
        break
        }

export default Products


