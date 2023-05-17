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
import { authorizeRol, authenticateToken } from '../../utils.js'
import errorHandler from '../../middlewares/errors/errors.js'

const router = Router()

router.get('/', authenticateToken, authorizeRol('admin') ,getProducts)

router.get('/:pid', authenticateToken, authorizeRol('admin'), getProductById)

router.post('/', authenticateToken, authorizeRol('admin'), createProduct)

router.put('/:pid', authenticateToken, authorizeRol('admin'), updateProduct)

router.delete('/:pid', authenticateToken, authorizeRol('admin'), deleteProduct)

export default router