import { Carts, Products } from '../dao/factory.js'
import CartsRepository from '../repository/carts.repository.js'
import ProductsRepository from '../repository/products.repository.js'
import { ticketModel } from '../dao/models/ticketModel.js'

const carts = new Carts()
const cartsRepository = new CartsRepository(carts)

const products = new Products()
const productsRepository = new ProductsRepository(products)

export const getAll = async () => {
    const carts = await cartsRepository.getAll()
    return carts
}

export const getByIdPopulated = async (cid) => {
    const cart = await cartsRepository.getById(cid)
    return cart
}

export const getCartById = async (cid) => {
    const cart = await cartsRepository.getCartById(cid)
    if(!cart || cart == 'undefined') return 'cartError'
    return cart
}

export const addCart = async (cart) => {
    const result = await cartsRepository.addCart(cart)
    return result
}

export const addProduct = async (cid, pid) => {
    const cartToUpdate = await cartsRepository.getById(cid)
    const product = await productsRepository.getProductById(pid)

    if(!cartToUpdate) return 'errorCart'
    if(!product) return 'errorProduct'

    const existingProduct = cartToUpdate.products.find(p => p.product._id == pid)

    if(existingProduct) {
        existingProduct.product = pid;
        
        existingProduct.quantity += 1;

        const result = await cartsRepository.updateCart(cid, cartToUpdate)
        return result
    } else {

        cartToUpdate.products.push({
            product: pid,
            quantity: 1
        })
        const result = await cartsRepository.updateCart(cid, cartToUpdate)
        return result
    }
}

export const deleteProduct = async (cid, pid) => {
    const cart = await cartsRepository.getById(cid)
    if(!cart || cart == 'undefined') {
        return 'error'
    }

    let products = cart.products
    const index = products.findIndex(p => p.product._id == pid)

    // const index = products.findIndex(p => console.log(p.product._id == pid))


    // if(index == -1) {
    //     return index
    // }

    products.splice(index, 1)
    const result = await cartsRepository.update(cid, cart.products)
    return result
}

export const deleteCart = async (cid) => {
    const cart = await cartsRepository.getCartById(cid)
    if(!cart || cart == 'undefined') {
        return 'cartError'
    }

    const result = cartsRepository.delete(cid)
    return result
}

export const updateQuantity = async (cid, pid, quantity) => {
    const cartToUpdate = await cartsRepository.getCartById(cid)
    const find = cartToUpdate.products.find(p => p.product._id == pid)
    find.quantity = quantity.quantity
    const result = await cartsRepository.updateCart(cid, cartToUpdate)
    return result
}

export const updateCart = async (cid, products) => {
    const result = await cartsRepository.updateCart(cid, products)
    return result
}

export const purchaseCart = async (cid) => {
    const cart = await cartsRepository.getById(cid)

    const productsInCart = cart.products
        const productsToUpdate = []
        const failedProducts = []

    if(!cart) {
        return 'errorCart'
    }

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
        // console.log( await deleteProduct(cid, productStock.product._id))
        await deleteProduct(cid, productStock.product._id)
    }

    if (!productsToUpdate || productsToUpdate == null || productsToUpdate == undefined || productsToUpdate.length == 0) return {error: 'errorStock', failedProducts}

    //Actualizar el stock de los products
    console.log(productsToUpdate[0])
    const updateResults = await Promise.all(productsToUpdate.map(async productToUpdate => await productsRepository.updateProduct(productToUpdate.product._id, productToUpdate.product)))
    if (updateResults.some(result => !result)) return 'errorUpdatingProduct'

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


    const ticket = await cartsRepository.purchase({
        code: tickets.length == 0 ? 0 : tickets.length,
        purchase_datetime: date.toUTCString(),
        amount: totalprice(productsToUpdate),
        purchaser: cart.user
    })

    return ticket

}

