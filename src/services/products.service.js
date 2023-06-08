import { Products } from "../dao/factory.js"
import ProductsRepository from "../repository/products.repository.js"

const products = new Products()
const productsRepository = new ProductsRepository(products)

export const getAll = async () => {
    const products = await productsRepository.getAll()
    return products
}

export const getProductById = async (id) => {
    const product = await productsRepository.getProductById(id)
    return product
}

export const createProduct = async (product) => {
    const result = await productsRepository.createProduct(product)
    return result
}

export const update = async (pid, product) => {
    const result = await productsRepository.updateProduct(pid, product)
    return result
}

export const deleteProduct = async (pid) => {
    const result = await productsRepository.deleteProduct(pid)
    return result
}