import {
    Router
} from 'express'
import {
    getCarts,
    createCart,
    getCartById,
    addProductInCart,
    deleteProductInCart,
    deleteCart,
    updateQuantity,
    updateCart,
    purchaseCart
} from '../../controllers/carts.controller.js'
import { authenticateToken, authorizeRol } from '../../utils.js'

const router = Router()

router.get('/', getCarts)

router.get('/:cid', getCartById)

router.post('/', authenticateToken, authorizeRol('user') , createCart)

router.post('/:cid/products/:pid', authenticateToken, authorizeRol('user'), addProductInCart)

router.put('/:cid/products/:pid', updateQuantity)

router.put('/:cid', updateCart);

router.delete('/:cid/products/:pid', deleteProductInCart);

router.delete('/:cid', deleteCart)

router.post('/:cid/purchase', authenticateToken ,purchaseCart)


export default router