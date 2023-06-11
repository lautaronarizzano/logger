import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing de productos post', () => {
    it('POST de /api/products debe crear un producto correctamente y debe tener el atributo _id de mongodb', async () => {
        const userMock = {
            email: 'admin1@gmail.com',
            password: 'admin11234'
        }

        await requester.post('/api/sessions/login').send(userMock)
        const productMock = {
            title: "prueba31dsa",
            description: "descripcion",
            code: "abdfssd3412562313adasdas312dsads",
            price: 180,
            stock: 20,
            status: true,
            category: "comida"
        }

        const { statusCode, ok, _body } = await requester.post('/api/products').send(productMock)

        expect(statusCode).to.be.eql(200)
        expect(_body.payload).to.have.property('_id')
    })
    it('POST de /api/products debe corroborar que el producto tenga el campo status: true', async () => {

        const userMock = {
            email: 'adminln@gmail.com',
            password: 'adminln1234'
        }

        await requester.post('/api/sessions/login').send(userMock)
        const productMock = {
            title: "prueba31dsa",
            description: "descripcion",
            code: "abdfssda412364adasdasdsads",
            price: 180,
            stock: 20,
            status: true,
            category: "comida"
        }
    
        const { statusCode, ok, _body } = await requester.post('/api/products').send(productMock)
    
        expect(statusCode).to.be.eql(200)
        expect(_body.payload).to.have.property('status')
        expect(_body.payload.status).to.be.eql(true)
    })
    it('POST de /api/products se debe corroborar que si el code ya exiiste debe retornar un bad request (400)', async () => {
        const productMock = {
            title: "prueba31dsa",
            description: "descripcion",
            code: "a00",
            price: 180,
            stock: 20,
            status: true,
            category: "comida"
        }
    
        const { statusCode } = await requester.post('/api/products').send(productMock)
    
        expect(statusCode).to.be.eql(400)
    })
})

