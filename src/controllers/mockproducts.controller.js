import { generateProduct } from "../utils/utils.js"

    const get = async () => {
        try {
            let users = []
        for (let i = 0; i < 100; i++) {
            users.push(generateProduct())
        }

        res.send({
            count: users.length,
            data: users
        })
        } catch (error) {
            req.logger.fatal(error)
            res.status(500).send({error: error})
        }
    }

export {
    get
}