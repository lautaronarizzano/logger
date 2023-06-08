import { productModel } from '../dao/models/productModel.js'
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import { incompleteFieldError } from '../services/errors/info.js'
import * as productsService from '../services/products.service.js'


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
                res.status(400).send({status: 'error', payload: 'query is not valid'})
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
        const products = await productsService.getProductById(pid)
        if(!products || products.length === 0) {
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

const createProduct = async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category, status} = req.body

    const products = await productsService.getAll()
    
    
    try {
        if(!title || !description || !price || !code || !stock || !category) {
            throw CustomError.createError({
                name: 'IncompleteValuesError',
                cause: incompleteFieldError(),
                message: 'Error intentando crear producto',
                code: EErrors.PRODUCT_FIELDS_ERROR
            })
        } 
        const product = products.find(p => p.code == code)

        if(product) {
            req.logger.error('Product already exists')
            return res.status(400).send({status: 'error', error: 'Product already exists'})
        }
        const result = await productsService.createProduct({
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
        console.log(error)
        req.logger.fatal(error)
        res.status(500).send({error: error})
    }
}

const updateProduct = async (req, res) => {
    const pid = req.params.pid
    const product = req.body

    const products = await productsService.getProductById(pid)

    if(!products) {
        req.logger.error('Cannot found product')
        return res.status(404).send({error:'Product not found'})
    }

        if(req.user.user.rol == 'premium' && products[0].owner !== req.user.user.email) {
            req.logger.error(`Cannot edit if isn't your own product`)
            return res.status(400).send({error: `Cannot edit if isn't your own product`})
        }
    try {
        const result = await productsService.update(pid, product)
        res.send({status: 'success', payload: result})
    } catch (error) {
        console.log(error)
        req.logger.fatal(error)
        res.status(500).send({ error })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid
        const product = await productsService.getProductById(pid)

        if(req.user.user.rol == 'premium' && product[0].owner !== req.user.user.email) {
            req.logger.error(`Cannot delete if isn't your own product`)
            return res.status(400).send({error: `Cannot delete if isn't your own product`})
        }
        const result = await productsService.deleteProduct(pid)
        res.send({status: 'success', payload: result})
    } catch (error) {
        console.log(error)
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