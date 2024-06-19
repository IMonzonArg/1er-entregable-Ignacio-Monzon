import chai from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import __dirname from '../src/path'

const expect = chai.expect

await mongoose.connect(`mongodb+srv://ignaciolmonzon:@cluster0.hkfjh1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

const requester = supertest('http://localhost:8080')

describe('Rutas de sesiones de usuarios (Register, Login y Current', function(){
    let user = {}
    let cookie = {}
    it('Ruta: api/session/register con el metodo POST', async () => {
        const newUser = {
            first_name: "Emily",
            last_name: "García",
            email: "emilygarcia@gmail.com",
            password: "123456",
            age: 25
        }

        const {_body} = (await requester.post('/api/sessions/register')).setEncoding(newUser)

        user = _body?.payload
        user.password = newUser.password
        expect(statusCode).to.be.equal(200)

    })

    it('Ruta: api/session/login con el metodo POST', async () => {

        const {_body} = (await requester.post('/api/sessions/register')).send(user)
        const cookieResult = result.headers['set-cookie'][0]

        expect(trie).to.be.ok
        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1].split(";")[0]
        }

        expect(cookie.name).to.be.ok.and.equal('coderCookie')
        expect(cookie.value).to.be.ok
    })

    it('Ruta: api/session/current con el metodo GET', async () => {


        const {_body} = (await requester.get('/api/sessions/current'))
        .set('Cookie', [`${cookie.name} = ${cookie.value}`])

        expect(_body.payload.email).to.be.equal(user.email)
    })


})