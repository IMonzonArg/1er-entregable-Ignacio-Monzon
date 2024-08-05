import chai from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';
import cartModel from '../src/models/cart.js';
import productModel from '../src/models/product.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

let cartId;
let adminToken = '';
let testProductId;

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://<usuario>:<contraseña>@cluster0.hkfjh1t.mongodb.net/test?retryWrites=true&w=majority');
    const testProduct = await productModel.create({
        name: 'Producto de prueba',
        price: 100,
        stock: 50,
        category: 'test'
    });
    testProductId = testProduct._id;

    const newCart = await cartModel.create({ products: [] });
    cartId = newCart._id;
});

describe('Rutas del carrito (Cart API)', function () {
    it('Debería crear un nuevo carrito con POST /api/cart', async () => {
        const { body, statusCode } = await requester.post('/api/cart');
        expect(statusCode).to.be.equal(201);
        expect(body).to.be.an('object');
        expect(body).to.have.property('id');
        cartId = body.id;
    });

    it('Debería obtener un carrito por su ID con GET /api/cart/:cid', async () => {
        const { body, statusCode } = await requester.get(`/api/cart/${cartId}`);
        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('_id').eql(cartId.toString());
    });

    it('Debería agregar un producto al carrito con POST /api/cart/:cid/products/:pid', async () => {
        const { body, statusCode } = await requester.post(`/api/cart/${cartId}/products/${testProductId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 3 });

        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        const productInCart = body.products.find(product => product.id_prod.toString() === testProductId.toString());
        expect(productInCart).to.exist;
        expect(productInCart).to.have.property('quantity').eql(3);
    });

    it('Debería actualizar la cantidad de un producto en el carrito con PUT /api/cart/:cid/products/:pid', async () => {
        const { body, statusCode } = await requester.put(`/api/cart/${cartId}/products/${testProductId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 5 });

        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        const productInCart = body.products.find(product => product.id_prod.toString() === testProductId.toString());
        expect(productInCart).to.exist;
        expect(productInCart).to.have.property('quantity').eql(5);
    });

    it('Debería eliminar un producto del carrito con DELETE /api/cart/:cid/products/:pid', async () => {
        const { body, statusCode } = await requester.delete(`/api/cart/${cartId}/products/${testProductId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(statusCode).to.be.equal(200);
        const productInCart = body.products.find(product => product.id_prod.toString() === testProductId.toString());
        expect(productInCart).to.not.exist;
    });

    it('Debería vaciar el carrito con DELETE /api/cart/:cid', async () => {
        await requester.post(`/api/cart/${cartId}/products/${testProductId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 2 });

        const { body, statusCode } = await requester.delete(`/api/cart/${cartId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('message').eql('El carrito se vació correctamente');
    });

    it('Debería actualizar el carrito con PUT /api/cart/:cid', async () => {
        const newProducts = [{ id_prod: testProductId, quantity: 4 }];
        const { body, statusCode } = await requester.put(`/api/cart/${cartId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ products: newProducts });

        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        const productInCart = body.products.find(product => product.id_prod.toString() === testProductId.toString());
        expect(productInCart).to.exist;
        expect(productInCart).to.have.property('quantity').eql(4);
    });

    it('Debería generar un ticket con POST /api/cart/:cid/ticket', async () => {
        const { body, statusCode } = await requester.post(`/api/cart/${cartId}/ticket`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(statusCode).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('code');
        expect(body).to.have.property('products').to.be.an('array');
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });
});
