import { Router } from "express";
import { CartManager } from '../config/CartManager.js';
import path from 'path';

// Obtener la ruta del directorio del archivo actual (__dirname)
const currentDir = process.cwd();

// Construir la ruta completa del archivo cart.json
const cartFilePath = path.join(currentDir, 'src', 'data', 'cart.json');

console.log('Cart file path:', cartFilePath);

const cartManager = new CartManager(cartFilePath);
const cartRouter = Router();

cartRouter.get('/', async (req, res) => {
    try {
        const cart = await cartManager.getCart();
        res.status(200).send(cart);
    } catch(error){
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
});

cartRouter.post('/:pid', async (req, res) => {
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
