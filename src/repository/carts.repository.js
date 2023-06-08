export default class CartsRepository {
    constructor (dao) {
        this.dao = dao
    }

    getAll = async () => {
        const result = await this.dao.getAll()
        return result
    }

    getById = async (cid) => {
        const result = await this.dao.getById(cid)
        return result
    }

    getCartById = async (cid) => {
        const result = await this.dao.getCartById(cid)
        return result
    }

    addCart = async (cart) => {
        const result = await this.dao.addCart(cart)
        return result
    }

    update = async (cid, newProds) => {
        const result = await this.dao.update(cid, newProds)
        return result
    }

    updateCart = async (cid, newCart) => {
        const result = await this.dao.updateCart(cid, newCart)
        return result
    }

    delete = async (cid) => {
        const result = await this.dao.delete(cid)
        return result
    }

    purchase = async (ticket) => {
        const result = await this.dao.purchase(ticket)
        return result
    }

}