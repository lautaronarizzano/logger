// import Products from '../dao/dbManagers/products.js'
import { productModel } from '../dao/models/productModel.js'
import Products from '../dao/factory/products.factory.js'
import ProductsRepository from '../repository/products.repository.js'
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import { incompleteFieldError } from '../services/errors/info.js'

const productManager = new Products()

const productsRepository = new ProductsRepository(productManager)

const getProducts = async (req, res) => {
    const { limit = 10, page = 1, query , sort } = req.query
    try {        

        if (query == undefined) {
            const productsPaginates = await productModel.paginate({ }, {limit: limit, page: page, sort:{ price: sort}}, (err, result) => {
                    const nextPage = result.hasNextPage && `localhost:8080/api/products?limit=${limit}&page=${result.nextPage}`
                    const prevPage = result.hasPrevPage && `localhost:8080/api/products?limit=${limit}&page=${result.prevPage}`
                const response = {
                    ...result,
                    nextLink: nextPage,
                    prevLink: prevPage 
                }
                res.send({status: 'success', payload: response})
            })
            
        } else {
            if(query == "comida" || query == "bebida" || query == "complemento") {
                const productsPaginates = await productModel.paginate({ category: query }, {limit: limit, page: page, sort:{ price: sort}}, (err, result) => {
                    const nextPage = result.hasNextPage ? `localhost:8080/api/products?query=${query}&limit=${limit}&page=${result.nextPage}`: null
                    const prevPage = result.hasPrevPage ? `localhost:8080/api/products?query=${query}limit=${limit}&page=${result.prevPage}`: null
                const response = {
                    ...result,
                    nextLink: nextPage,
                    prevLink: prevPage 
                }
                res.send({status: 'success', payload: response})
                })
            }
            else if(query == "true" || query == "false"){
                const productsPaginates = await productModel.paginate({ status: query }, {limit: limit, page: page, sort:{ price: sort}}, (err, result) => {
                    const nextPage = result.hasNextPage ? `localhost:8080/api/products?query=${query}&limit=${limit}&page=${result.nextPage}`: null
                    const prevPage = result.hasPrevPage ? `localhost:8080/api/products?query=${query}limit=${limit}&page=${result.prevPage}`: null
                const response = {
                    ...result,
                    nextLink: nextPage,
                    prevLink: prevPage 
                }
                res.send({status: 'success', payload: response})
                })
            }
            else{
                req.logger.error('query is not valid')
                res.send({status: error, payload: 'query is not valid'})
            }
        }

    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({ error })
    }
}

const getProductById = async (req, res) => {
    const pid = req.params.pid
    try {
        const products = await productsRepository.getProductById(pid)
        if(products) {
            CustomError.createError({
                name: 'PIDError',
                cause: generatePIDErrorInfo({
                    pid
                }),
                message: 'Error tratando de encontrar un producto mediante el id',
                code: EErrors.PRODUCT_ID_LEFT_ERROR
            })
        }
        res.send({status: 'success', payload: products})
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({ error })
    }
}
// const getProductById = async (req, res) => {
//     const pid = req.params.pid
//     try {
//         const products = await productManager.getById(pid)
//         res.send({status: 'success', payload: products})
//     } catch (error) {
//         res.status(500).send({ error })
//     }
// }

const createProduct = async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category, status} = req.body
    
    
    try {
        if(!title || !description || !price || !code || !stock || !category) {
            throw CustomError.createError({
                name: 'IncompleteValuesError',
                cause: incompleteFieldError(),
                message: 'Error intentando crear producto',
                code: EErrors.PRODUCT_FIELDS_ERROR
            })
        } 
        const result = await productManager.save({
            title,
            description,
            price,
            thumbnail,
            code,
            status,
            stock,
            category,
            owner: req.user? req.user.user.email : 'admin'
        })
        res.send({result: 'success', payload: result})

    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({error: error})
    }
}

const updateProduct = async (req, res) => {
    const pid = req.params.pid
    const product = req.body
    try {
        const result = await productManager.update(pid, product)
        res.send({status: 'success', payload: result})
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({ error })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid
        const result = await productManager.delete(pid)
        res.send({status: 'success', payload: result})
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({ error })
    }
}

export {
getProducts,
getProductById,
createProduct,
updateProduct,
deleteProduct
}