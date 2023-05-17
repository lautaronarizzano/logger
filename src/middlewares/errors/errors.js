import EErrors from '../../services/errors/enums.js'

export default (error, req, res, next) => {
    req.logger.error(error)
    switch (error.code) {
        case EErrors.PRODUCT_FIELDS_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case EErrors.PRODUCT_NOT_FOUND:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            })
            break;
        case EErrors.LOGIN_FAILED:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            })
            break;
        case EErrors.REGISTER_FAILED:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            })
            break;
        case EErrors.LOGIN_AUTH_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            })
            break;
        case EErrors.USER_NOT_FOUND:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            })
            break;
        default:
            res.send({
                status: 'error',
                error: 'unhandled error'
            })
            break;
    }
    next()
}


