import { productModel } from "../models/product.js";
import { Router } from "express";

const productsRouter = Router()
productsRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        console.log(limit);
    
        const products = await productModel.find().lean();
        
        if (limit !== undefined) {
            const limitNumber = parseInt(limit);
            if (!isNaN(limitNumber)) {
                const prodsLimit = products.slice(0, limitNumber);
                res.render('home', {
                    mostrarProductos: true,
                    productos: prodsLimit,
                    css: 'products.css'
                });
                return;
            } else {
                res.status(400).send("Error al consultar productos. El valor de 'limit' no es un número válido.");
                return;
            }
        }
        
        return res.render('home', { mostrarProductos: true, productos: products, css: 'products.css' });
    } catch(error){
        res.status(500).send(`Error interno del servidor al consultar productos: ${error}`);
    }
});

    

    productsRouter.get('/:pid', async (req, res) => {
        try {
            const { id } = req.params;
            const product = await productModel.findById(id);
            res.status(200).send(product)
        } catch(error) {
            res.status(500).send(`Error interno del servidor al consultar producto: ${error}`);
        }
    });
    
    productsRouter.post('/', async (req, res) => {
        try {
            const prod = req.body
            const message = await productModel.create(prod)
                res.status(201).send(message)
        } catch(error) {
            res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
        }
    });
    

    productsRouter.put('/:pid', async (req, res) => {
        try {
            const { id } = req.params;
            const prodUpdate = req.body;
            const prod = await productModel.findByIdAndUpdate(id, prodUpdate)
            res.status(200).send(prod)

        } catch(error) {
            res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`);
        }
    });

    productsRouter.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const message = await productModel.findByIdAndDelete(id)
            res.status(200).send(message)
            
        } catch(error) {
            res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`);
        }
    });


export default productsRouter