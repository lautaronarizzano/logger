import ProductDto from '../dao/DTOs/products.dto.js'

export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }


    getProductById = async (pid) => {
        const result = await this.dao.getById(pid)
        return result
    }

    createProduct = async (product) => {
        const productDto = new ProductDto(product)
        const result = await this.dao.create(productDto)
        return result
    }

    updateProduct = async (pid, product) => {
        const result = await this.dao.update(pid, product)
        return result
    }

    deleteProduct = async (pid) => {
        const result = await this.dao.delete(pid)
        return result

    }
}