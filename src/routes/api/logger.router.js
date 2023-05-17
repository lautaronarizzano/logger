import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    //Loguear a nivel consola
    req.logger.fatal('Prueba fatal')
    req.logger.error('Prueba error')
    req.logger.warning('Prueba warning')
    req.logger.info('Prueba info')
    req.logger.debug('Prueba debug')

    res.send({message: 'Prueba logger'})
})

export default router