import express from 'express';
import { ProductManager } from './config/productManager.js';

const app = express();
const PORT = 8080;
const productManager = new ProductManager('./src/productos.json');

productManager.initFile().then(() => {
    app.get('/', (req, res) => {
        res.send('Hola desde mi primer servidor en express');
    });

    app.get('/products', async (req, res) => {
        const { limit } = req.query;
        console.log(limit);
    
        const products = await productManager.getProducts();
        const limitNumber = parseInt(limit, 10);
    
        if (!isNaN(limitNumber)) {
            const prodsLimit = products.slice(0, limitNumber);
            res.send(prodsLimit);
        } else {
            res.send(products);
        }
    });
    

    app.get('/products/:id', async (req, res) => {
        const { id } = req.params;
        const product = await productManager.getProductById(id);
        
        res.send(product);
    });
    
    app.listen(PORT, () => {
        console.log(`Server on port ${PORT}`);
    });
});
