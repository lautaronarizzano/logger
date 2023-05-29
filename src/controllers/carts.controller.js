import Carts from '../dao/factory/carts.factory.js'
import Products from '../dao/factory/products.factory.js'
import {
    ticketModel
} from '../dao/models/ticketModel.js'

const cartsManager = new Carts()
const productsManager = new Products()

const getCarts = async (req, res) => {
    try {
        const carts = await cartsManager.getAll()
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

const createCart = async (req, res) => {
    const cart = req.body
    try {
        const result = await cartsManager.addCart(cart)
        res.send({
            status: 'success',
            payload: result
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
        const result = await cartsManager.getById(cid)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
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
        const cart = await cartsManager.getById(cid)
        // const product = cart.products.find(p => p.product._id == pid)
        const product = await productsManager.getById(pid)

        console.log(product[0].owner)
        if(req.user.user.rol == 'premium' && product[0].owner == req.user.user.email) {
            req.logger.error(`can't add your own product ${product[0].title}`)
            return res.status(400).send({error: `can't add your own product ${product[0].title}`})
        }
        const result = await cartsManager.addProduct(cart, product)
        res.send({
            status: 'success',
            message: 'The product with id ' + pid + ' was added successfully from cart ' + cid + '',
            payload: result
        })
    } catch (error) {
        console.log(error)
        req.logger.fatal(error)
        res.status(500).send({
            error: 'el error es ' + error
        })
    }
}

const deleteProductInCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        await cartsManager.deleteProduct(cid, pid)
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
        const result = await cartsManager.delete(cid)
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
        return res.send('hola')
    }
    try {
        const result = await cartsManager.updateQuantity(cid, pid, quantity)
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
    const cartId = req.params.cid;
    const products = req.body;
    try {
        const result = cartsManager.updateCart(cartId, products)
        res.send({
            status: 'success',
            message: 'The cart with id ' + cartId + ' was updated successfully with the required products.'
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
        const cart = await cartsManager.getById(cid)
        if (!cart) return res.status(404).send({
            status: 'error',
            message: 'Cart not found'
        })
        const productsInCart = cart.products
        const productsToUpdate = []
        const failedProducts = []

        //validar el stock y restar
        const productsStock = productsInCart.filter(p => p.product.stock >= p.quantity)
        for (let i = 0; i < productsInCart.length; i++) {
            const product = productsInCart[i].product
            const quantity = productsInCart[i].quantity
            if (product.stock < quantity) {
                failedProducts.push(product._id)
            }

        }
        for (let j = 0; j < productsStock.length; j++) {
            const productStock = productsStock[j];
            if (productStock) {
                productStock.product.stock -= productsStock[j].quantity;
                productsToUpdate.push(productStock)
            }
            await cartsManager.deleteProduct(cid, productStock.product._id)
        }

        if (!productsToUpdate || productsToUpdate == null || productsToUpdate == undefined || productsToUpdate.length == 0) return res.status(400).json({
            error: 'Not enough products with stock',
            failedProducts
        })

        //Actualizar el stock de los products
        const updateResults = await Promise.all(productsToUpdate.map(productToUpdate => productsManager.update(productToUpdate._id, productToUpdate)))
        if (updateResults.some(result => !result)) return res.status(500).send({
            status: 'error',
            message: 'Error updating product stock'
        })

        //Generar el stock de compra

        const tickets = await ticketModel.find()

        const date = new Date

        const totalprice = products => {
            let total = 0;
            for (let k = 0; k < products.length; k++) {
                const product = products[k].product
                const quantity = products[k].quantity;
                const subtotal = product.price * quantity;
                total += subtotal;
            }
            return total;
        }


        const ticket = await cartsManager.purchase({
            code: tickets.length == 0 ? 0 : tickets.length,
            purchase_datetime: date.toUTCString(),
            amount: totalprice(productsToUpdate),
            purchaser: cart.user
        })


        res.status(200).send({
            status: 'success',
            mesage: 'purchase success',
            payload: ticket
        })

    } catch (error) {
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