import { productModel } from '../models/productModel.js'

export default class Products {
    constructor() {
        console.log('Working products with DB in mongoDB')
    }

    getAll = async () => {
        const products = await productModel.find()
        return products.map(prod => prod.toObject())
    }

    save = async (product) => {
        const result = await productModel.create(product)
        return result
    }

    getById = async (id) => {
        const result = await productModel.find({_id : id})
        return result
    }

    update = async (id, product) => {
        const result = await productModel.updateOne({_id: id}, product)
        return result
    }

    delete = async (id) => {
        const result = await productModel.deleteOne({_id: id})
        return result
    }
}