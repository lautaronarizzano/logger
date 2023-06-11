import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing de sessions', () => {
    let cookie

    it('POST de /api/sessions/register debe crear un usuario exitosamente y despues eliminarlo asi se peude testear de nuevo', async () => {
        const registro = {
                first_name: "Prueba",
                last_name: "Y",
                age: 25,
                email: "p63@gmail.com",
                password: "p631234",
                rol: "user"
        }
        const { statusCode } = await requester.post('/api/sessions/register').send(registro)
        expect(statusCode).to.be.eql(200)
        await requester.delete('/api/users/p63@gmail.com')
    })
    it('POST de /api/sessions/login debe retornar una cookie', async () => {
        const userMock = {
            email: 'mv@gmail.com',
            password: 'mv1234'
        }

        const loginResult = await requester.post('/api/sessions/login').send(userMock)
        const cookieResult = loginResult.headers['set-cookie'][0]

        expect(cookieResult).to.be.ok

        const cookiueResultSplited = cookieResult.split('=')

        cookie = {
            name: cookiueResultSplited[0],
            value: cookiueResultSplited[1]
        }

        expect(cookie.name).to.be.ok.and.eql('cookieToken')
        expect(cookie.value).to.be.ok

    })
    it('Debemos enviar una cookie en el servicio current y entregue la informacion del usuario', async () => {
        const { statusCode,_body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`])

        expect(statusCode).to.be.eql(200)
        expect(_body.payload.email).to.be.eql('mv@gmail.com')
    })

})