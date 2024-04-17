import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController"; 

const productsRouter = Router()
productsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, filter, ord } = req.query

        const prods = await getProducts(limit = 10, page = 1, filter, ord )

        res.status(200).send(products)
    } catch(error){
        res.status(500).send(`Error interno del servidor al consultar productos: ${error}`);
    }
});

    

    productsRouter.get('/:pid', async (req, res) => {
        try {
            const { id } = req.params;
            const prod = await getProduct(id)
            if(prod) 
                res.status(200).send(product)
            else 
                res.status(404).send('No se ha encontrado el producto')
        } catch(error) {
            res.status(500).send(`Error interno del servidor al consultar producto: ${error}`);
        }
    });
    
    productsRouter.post('/', async (req, res) => {
        try {
            const prod = req.body
            const message = await createProduct(product)
                res.status(201).send(message)
        } catch(error) {
            res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
        }
    });
    

    productsRouter.put('/:pid', async (req, res) => {
        try {
            const { id } = req.params;
            const prodUpdate = req.body;
            const prod = await updateProduct(id, prodUpdate)
            res.status(200).send(prod)
        } catch(error) {
            res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`);
        }
    });

    productsRouter.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const message = await deleteProduct(id)
            res.status(200).send(message)
            
        } catch(error) {
            res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`);
        }
    });


export default productsRouter