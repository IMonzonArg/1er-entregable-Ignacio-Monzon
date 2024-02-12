import { Router } from "express";
import { ProductManager } from '../config/productManager.js';

const productManager = new ProductManager('../data/productos.json');
const productsRouter = Router()


productsRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        console.log(limit);
    
        const products = await productManager.getProducts();
        
        if (limit !== undefined) {
            const limitNumber = parseInt(limit);
            if (!isNaN(limitNumber)) {
                const prodsLimit = products.slice(0, limitNumber);
                res.status(200).send(prodsLimit);
                return;
            } else {
                res.status(400).send("Error al consultar productos. El valor de 'limit' no es un número válido.");
                return;
            }
        }
        
        res.status(200).send(products); 
    } catch(error){
        res.status(500).send(`Error interno del servidor al consultar productos: ${error}`);
    }
});

    

    productsRouter.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const product = await productManager.getProductById(id);
            if( id )
            res.status(200).send(product)
            else
                res.status(404).send("Producto no existente")
        } catch(error) {
            res.status(500).send(`Error interno del servidor al consultar producto: ${error}`);
        }
    });
    
    productsRouter.post('/', async (req, res) => {
        try {
            const prod = req.body
            const message = await productManager.addProduct(prod)
            if(message == "Producto agregado correctamente" )
                res.status(200).send(message)
            else
                res.status(400).send(message)
        } catch(error) {
            res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
        }
    });
    

    productsRouter.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const prodUpdate = req.body;
            const message = await productManager.updateProduct(id,prodUpdate)
            if(message == "Producto actualizado correctamente" )
            res.status(200).send(message)
            else
                res.status(404).send(message)
        } catch(error) {
            res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`);
        }
    });

    productsRouter.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const message = await productManager.deleteProduct(id)
            if(message == "Producto eliminado correctamente" )
            res.status(200).send(message)
            else
                res.status(404).send(message)
        } catch(error) {
            res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`);
        }
    });


export default productsRouter