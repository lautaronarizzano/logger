import {
    Router
} from 'express'
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../../controllers/products.controller.js'
import { authorizeRol, authenticateToken } from '../../utils/utils.js'

const router = Router()

router.get('/', getProducts)
// router.get('/', authenticateToken, authorizeRol('admin'), getProducts)

router.get('/:pid', authenticateToken, authorizeRol('admin'), getProductById)

router.post('/', createProduct)
// router.post('/', authenticateToken, authorizeRol(['admin', 'premium']), createProduct)

router.put('/:pid', authenticateToken, authorizeRol(['admin', 'premium']), updateProduct)

router.delete('/:pid', authenticateToken, authorizeRol(['admin', 'premium']), deleteProduct)

export default router