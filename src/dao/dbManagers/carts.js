import CustomError from "../../services/errors/CustomError.js";
import EErrors from "../../services/errors/enums.js";
import { productNotFound } from "../../services/errors/info.js";
import {cartsModel} from "../models/cartsModel.js";
import { ticketModel } from '../models/ticketModel.js'

export default class Carts {
    constructor() {
        console.log('Working carts with DB in mongoDB')
    }

    getAll = async () => {
        const carts = await cartsModel.find().populate('products.product')
        return carts
    }

    getCartById = async(cid) => {
        const searchedCart = await cartsModel.findOne({_id:cid});
        if (!searchedCart || searchedCart.length == 0) {
            return 'Cart not found'
        }
        return searchedCart;
    }

    getById = async (cid) => {
        const result = await cartsModel.findOne({
            "_id": cid
        }).populate('products.product')
        if(!result || result.length == 0) {
            return 'Cart not found'
        }
        return result
    }

    addCart = async (cart) => {
        const result = await cartsModel.create(cart)
        return result
    }

    addProduct = async (cid, pid) => {
        
        try{
            const cartToUpdate = await this.getCartById(cid)
            if(!cid || !pid) return res.status(400).send({error: "cid or pid not found"})
    
            const addPost = async (post) =>{
    
                try {
                    // const existingPost = cartToUpdate.products.find(p => console.log(p));
                    const existingPost = cartToUpdate.products.find(p => p.product == post);

                    console.log('El id es: ' + existingPost)
        
                    if(!existingPost) {
                        throw CustomError.createError({
                            name: `Product doesn't exist`,
                            cause: productNotFound(pid),
                            message: 'Error intentando agregar producto al carrito',
                            code: EErrors.PRODUCT_NOT_FOUND
                        })
                    }
        
                    if (existingPost) {
        
                        // Actualizar post existente
                        existingPost.product = pid;
        
                        existingPost.quantity += 1;
        
                        let result = await cartsModel.updateOne({_id: cid}, cartToUpdate)
        
                        return result
                    } else {
        
                        // Agregar nuevo post
                        cartToUpdate.products.push({
                            product: post,
                            quantity:1
                        })
                        let result = await cartsModel.updateOne({_id: cid}, cartToUpdate)
                        return result
                    }
                    
                } catch (error) {
                    return console.log(error)
                }
            }
            addPost(pid)

        } catch (error){
            res.status(500).send({error: error})
        }

    }

    update = async (cid,newprods) =>{
        let result = await cartsModel.updateOne({_id: cid},{products:newprods});
        return result;
    }


    deleteProduct = async (cid, pid) => {
        const cart = await this.getCartById(cid)
        let products = cart.products;
        const index = products.findIndex(p => p.product._id == pid)
        if(index == -1) {
            console.log('hola')
            res.status(404).send('hola')
        }
            
        products.splice(index, 1)
        this.update(cid, cart.products)
    }

    delete = async(cid) => {
        const result = await cartsModel.deleteOne({_id: cid})
        return result
    }

    updateQuantity = async(cid, pid, quantity) => {
        const cartToUpdate = await this.getCartById(cid)

        const find = cartToUpdate.products.find(p => p.product._id == pid)

        find.quantity = quantity.quantity

        const result = cartsModel.updateOne({_id: cid }, cartToUpdate)

        return result

    }

    updateCart = async(cid, newCart) => {
        const result = await cartsModel.updateOne({_id: cid}, newCart)
        return result
    }

    purchase = async (ticket) => {
        const result = await ticketModel.create(ticket)
        return result
    }
}






