import { Router } from "express";
import { CartManager } from '../config/CartManager.js';
import path from 'path';

const currentDir = process.cwd();

const cartFilePath = path.join(currentDir, 'src', 'data', 'cart.json');

const cartManager = new CartManager(cartFilePath);
const cartRouter = Router();

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCart();
        res.status(200).send(cart);
    } catch(error){
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
});

cartRouter.post('/', async(req,res) => {
    try{
        const newCartId = await  cartManager.createCart();
        res.status(200).send({id: newCartId})
    } catch(error){
        res.status(500).send( `Error interno del servidor al crear un nuevo carrito: ${error}`)
    }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { pid } = req.params; 
        const { quantity } = req.body;
        const message = await cartManager.addProductByCart(pid, quantity); 
        res.status(200).send(message);
    } catch(error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
    }
});

export default cartRouter;
