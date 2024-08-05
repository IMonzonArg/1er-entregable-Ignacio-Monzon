import chai from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';
import __dirname from '../src/path.js';

const expect = chai.expect;

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://<usuario>:<contraseña>@cluster0.hkfjh1t.mongodb.net/test?retryWrites=true&w=majority');
});

const requester = supertest('http://localhost:8080');

describe('Rutas de sesiones de usuarios (Register, Login y Current)', function() {
    let user = {};
    let cookie = {};
    it('Ruta: api/session/register con el metodo POST', async () => {
        const newUser = {
            first_name: "Emily",
            last_name: "García",
            email: "emilygarcia@gmail.com",
            password: "123456",
            age: 25
        };

        const { body, statusCode } = await requester.post('/api/sessions/register').send(newUser);

        user = body?.payload;
        user.password = newUser.password;
        expect(statusCode).to.be.equal(200);

    });

    it('Ruta: api/session/login con el metodo POST', async () => {

        const result = await requester.post('/api/sessions/login').send(user);
        const cookieResult = result.headers['set-cookie'][0];

        expect(result).to.be.ok;
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1].split(';')[0]
        };

        expect(cookie.name).to.be.ok.and.equal('coderCookie');
        expect(cookie.value).to.be.ok;
    });

    it('Ruta: api/session/current con el metodo GET', async () => {

        const { body } = await requester.get('/api/sessions/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(body.payload.email).to.be.equal(user.email);
    });
});
