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


    update = async (cid,newprods) =>{
        let result = await cartsModel.updateOne({_id: cid},{products:newprods});
        return result;
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






