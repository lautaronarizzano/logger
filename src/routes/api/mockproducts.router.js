import {
    Router
} from 'express'
import {
    get
} from '../../controllers/mockproducts.controller.js'
import {
    generateProduct
} from '../../utils.js'

const router = Router()

// router.get('/', get)
router.get('/', async (req, res) => {
    let users = []
    for (let i = 0; i < 100; i++) {
        users.push(generateProduct())
    }

    res.send({
        count: users.length,
        data: users
    })
})

export default router