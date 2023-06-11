import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing de carts', () => {
    it('POST de /api/carts debe crear crear un carrito vacio correctamente', async () => {
        const userMock = {
            email: 'mv@gmail.com',
            password: 'mv1234'
        }

        await requester.post('/api/sessions/login').send(userMock)
        const array = {cart: []}
        const { statusCode, _body } = await requester.post('/api/carts').send(array)
        expect(statusCode).to.be.eql(200)
        expect(Array.isArray(_body.payload)).to.be.eql(true)
        expect(_body.payload.length).to.be.eql(0)
    })
    it('GET de /api/carts/:cid debe retornar un carrito y ese carrito debe tener un atributo user que indique el usuario de ese carrito', async () => {
        const { statusCode, _body } = await requester.get('/api/carts/6451515884a62517322e5eb4')
        expect(statusCode).to.be.eql(200)
        expect(typeof _body.payload.user).to.be.eql('string')
        expect(_body.payload.user.includes('@gmail.com')).to.be.eql(true)
    })
    it('GET de /api/carts debe retornar todos los carritos existentes y debe corroborar de que existan dichos carritos', async () => {
        const { statusCode, _body } = await requester.get('/api/carts')
        expect(statusCode).to.be.eql(200)
        expect(Array.isArray(_body.payload)).to.be.eql(true)
        expect(_body.payload.length).to.be.not.eql(0)
    })
})