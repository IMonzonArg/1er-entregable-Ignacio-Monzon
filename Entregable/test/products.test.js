import chai from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';
import productModel from '../src/models/product.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://<usuario>:<contraseña>@cluster0.hkfjh1t.mongodb.net/test?retryWrites=true&w=majority');
});

describe('Rutas de productos (Products API)', function() {
    let productId;
    let adminToken = '';

    it('Debería obtener todos los productos con GET /api/products', async () => {
        const { body, statusCode } = await requester.get('/api/products');
        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body.docs).to.be.an('array');
    });

    it('Debería crear un nuevo producto con POST /api/products', async () => {
        const newProduct = {
            name: "Producto de prueba",
            price: 100,
            stock: 50,
            category: "test"
        };

        const { body, statusCode } = await requester.post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newProduct);

        expect(statusCode).to.be.equal(201);
        expect(body).to.be.an('object');
        expect(body).to.have.property('_id');
        productId = body._id;
    });

    it('Debería obtener un producto por su ID con GET /api/products/:id', async () => {
        const { body, statusCode } = await requester.get(`/api/products/${productId}`);
        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('_id').eql(productId);
    });

    it('Debería actualizar un producto por su ID con PUT /api/products/:id', async () => {
        const updatedProduct = {
            name: "Producto de prueba actualizado",
            price: 120,
            stock: 60
        };

        const { body, statusCode } = await requester.put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updatedProduct);

        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('name').eql("Producto de prueba actualizado");
    });

    it('Debería eliminar un producto por su ID con DELETE /api/products/:id', async () => {
        const { body, statusCode } = await requester.delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('_id').eql(productId);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });
});
