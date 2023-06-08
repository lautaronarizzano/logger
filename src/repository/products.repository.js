import ProductDto from '../dao/DTOs/products.dto.js'

export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async () => {
        const result = await this.dao.getAll()
        return result
    }

    getProductById = async (pid) => {
        const result = await this.dao.getById(pid)
        return result
    }

    createProduct = async (product) => {
        const productDto = new ProductDto(product)
        const result = await this.dao.save(product)
        return result
    }

    updateProduct = async (pid, product) => {
        const result = await this.dao.update(pid, product)
        console.log(result)
        return result
    }

    deleteProduct = async (pid) => {
        const result = await this.dao.delete(pid)
        return result

    }
}