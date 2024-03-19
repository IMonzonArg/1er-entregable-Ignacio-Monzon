import { productModel } from "../models/product.js";
import { Router } from "express";


const productsRouter = Router()
productsRouter.get('/', async (req, res) => {
    try {
        const { limit, page, filter, ord } = req.query;
        let metFilter
        
        const pag = page !== undefined ? page : 1
        const limi = limit !== undefined ? limit : 10

        if(filter == "true" || filter == "false") {
            metFilter = "status"
        } else {
            if (filter !== undefined)
                metFilter = "category"
        }

        const query = metFilter != undefined ? {[metFilter]: filter } : {};
        const ordQuery = ord !== undefined ? { price : ord } : {};


        const products = await productModel.paginate(query, { limit: limi, page: pag, sort: ordQuery })


        res.status(200).send(products)
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