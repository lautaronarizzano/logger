import * as cartsService from '../services/carts.service.js'
import { getProductById } from '../services/products.service.js'
import CustomError from '../services/errors/CustomError.js'
import { productNotFound } from '../services/errors/info.js'
import EErrors from '../services/errors/enums.js'


const getCarts = async (req, res) => {
    try {
        const carts = await cartsService.getAll()
        res.send({
            status: 'success',
            payload: carts
        })
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({
            error
        })
    }
}

const getCartById = async (req, res) => {
    const cid = req.params.cid
    try {
        const cart = await cartsService.getByIdPopulated(cid)

        if(cart == 'cartError') {
            req.logger.error(`Cart id doesn't exist`)
            res.status(404).send({status: 'error', error: `Cart id doesn't exist or not found`})
        }

        res.send({
            status: 'success',
            payload: cart
        })
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({
            error
        })
    }
}

const createCart = async (req, res) => {
    const cart = req.body.cart
    try {

        // if(!cart || cart !== []) {
        //     req.logger.error('cart must be an []')
        //     res.status(400).send({ status: 'error', error: 'cart must be an []' })
        // }

        const result = await cartsService.addCart(cart)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        console.log(error)
        req.logger.fatal(error)
        res.status(500).send({
            error
        })
    }
}


const addProductInCart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        const result = await cartsService.addProduct(cid, pid)

        if(result == 'cartError') {
            req.logger.error(`cart doesn't exist`)
            res.status(404).send({ status: 'error', error: `cart doesn't exist`})
        }

        // if(!product) {
        //         throw CustomError.createError({
        //             name: `Product doesn't exist`,
        //             cause: productNotFound(pid),
        //             message: 'Error intentando agregar producto al carrito',
        //             code: EErrors.PRODUCT_NOT_FOUND
        //         })
        //     }

        if(result ==  'productError') {
            req.logger.error(`product doesn't exist`)
            res.status(404).send({ status: 'error', error: `product doesn't exist`})
        }

        if(req.user.user.rol == 'premium' && product[0].owner == req.user.user.email) {
            req.logger.error(`can't add your own product ${product[0].title}`)
            return res.status(400).send({error: `can't add your own product ${product[0].title}`})
        }

        res.send({
            status: 'success',
            message: 'The product with id ' + pid + ' was added successfully from cart ' + cid + '',
            payload: result
        })
    } catch (error) {
        console.log(error)
        req.logger.fatal(error)
        res.status(500).send(
            error
        )
    }
}

const deleteProductInCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const result = await cartsService.deleteProduct(cid, pid)

        if(result == 'error') {
            req.logger.error(`Cart doesn't exist`)
            res.status(404).send({ status: 'error', error: `Cart doesn't exist` })
        }

        if(result == -1) {
            req.logger.error(`Product doesn't exist in cart`)
            res.status(404).send({ status: 'error', error: `Product doesn't exist in cart` })
        }
        res.send({
            status: 'success',
            message: 'The product with id ' + pid + ' was deleted successfully from cart ' + cid + ''
        })
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({
            error: 'el error es ' + error
        })
    }
}

const deleteCart = async (req, res) => {
    const cid = req.params.cid
    try {
        const result = await cartsService.deleteCart(cid)

        if(result == 'cartError') {
            req.logger.error('Cart not found')
            return res.status(404).send({status: 'error', error: 'Cart not found'})
        }

        res.send({
            status: 'success',
            message: 'The cart with id ' + cid + 'was deleted successfully',
            payload: result
        })
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({
            error: 'el error es ' + error
        })
    }
}

const updateQuantity = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body
    if(!quantity) {
        req.logger.error('No se ha ingresado una cantidad')
        return res.status(400).send({status: 'error', error: `Quantity doesn't ingresed`})
    }
    try {
        const result = await cartsService.updateQuantity(cid, pid, quantity)
        res.send({
            status: 'success',
            message: 'The product with id ' + pid + ' was changed it quantity from cart ' + cid + '',
            payload: result
        })
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({
            error: 'el error es ' + error
        })
    }
}

const updateCart = async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;
    try {
        const result = cartsService.updateCart(cid, products)
        res.send({
            status: 'success',
            message: 'The cart with id ' + cid + ' was updated successfully with the required products.'
        });
    } catch (error) {
        req.logger.fatal(error)
        res.status(500).send({
            error: 'el error es ' + error
        })
    }
}


const purchaseCart = async (req, res) => {
    const cid = req.params.cid

    try {
        const result = await cartsService.purchaseCart(cid)
        if (result == 'errorCart') return res.status(404).send({
            status: 'error',
            message: 'Cart not found'
        })

        if (result.error && result.error == 'errorStock') return res.status(400).json({
            error: 'Not enough products with stock',
            failedProducts: result.failedProducts
        })

        //Actualizar el stock de los products
        if (result == 'errorUpdatingProduct') return res.status(500).send({
            status: 'error',
            message: 'Error updating product stock'
        })



        res.status(200).send({
            status: 'success',
            mesage: 'purchase success',
            payload: result
        })

    } catch (error) {
        console.log(error)
        req.logger.fatal(error)
        res.status(500).send(error)
    }
}


export {
    getCarts,
    createCart,
    getCartById,
    addProductInCart,
    deleteProductInCart,
    deleteCart,
    updateQuantity,
    updateCart,
    purchaseCart
}