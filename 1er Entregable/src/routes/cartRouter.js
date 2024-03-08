import { Router } from "express";
import cartModel from "../models/cart.js"

const cartRouter = Router();
cartRouter.post('/', async(req,res) => {
    try{
        const newCartId = await  cartModel.create({products: []});
        res.status(201).send({id: newCartId})
    } catch(error){
        res.status(500).send( `Error interno del servidor al crear un nuevo carrito: ${error}`)
    }
})

cartRouter.get('/:cid', async (req, res) => {

    try {
        const cartId = req.params.cid
        const cart = await cartModel.findById(cartId);
        res.status(200).send(cart);
    } catch(error){
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
});

cartRouter.post('/:cid/:pid', async (req, res) => {
    try {
        const pId = req.params.pid;
        const cartId = req.params.cid;
        const { quantity } = req.body;
        const cart = await cartModel.findById(cartId);

        // Busca el índice del producto en el carrito
        const existingProductIndex = cart.products.findIndex(productoCart => productoCart.id_prod.toString() === pId);

        if (existingProductIndex !== -1) {
            if (parseInt(quantity) === 0) {
                cart.products.splice(existingProductIndex, 1);
            } else {
                cart.products[existingProductIndex].quantity = parseInt(quantity);
            }
        } else {
            cart.products.push({ id_prod: pId, quantity: parseInt(quantity) });
        }

        await cart.save();

        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
    }
});



export default cartRouter;
