import { Router } from "express";
import cartModel from "../models/cart.js"
import { createCart, getCart, insertProductCart } from "../controllers/cartController.js";

const cartRouter = Router();
cartRouter.post('/', createCart)

cartRouter.get('/:cid', getCart);

cartRouter.post('/:cid/:pid', insertProductCart);

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const pId = req.params.pid;
        const cartId = req.params.cid;

        const cart = await cartModel.findById(cartId);

        const deletedProductIndex = cart.products.findIndex(productoCart => productoCart.id_prod.toString() === pId.toString());

        if (deletedProductIndex >= -1) {
            cart.products.splice(deletedProductIndex, 1);
            await cart.save();
            res.status(200).send("Producto eliminado correctamente");
        } else {
            res.status(400).send("El producto no se encuentra en el carrito");
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`);
    }
});

cartRouter.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedCartData = req.body;
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).send("El carrito especificado no fue encontrado");
        }
        cart.products = updatedCartData.products;

        await cart.save();

        res.status(200).send("El carrito fue actualizado correctamente");

    } catch (error) {
        console.error("Error interno del servidor al actualizar el carrito:", error);
        res.status(500).send(`Error interno del servidor al actualizar el carrito: ${error}`);
    }
});

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const pId = req.params.pid.toString();

        const cartId = req.params.cid;
        const { quantity } = req.body;
        
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).send("El carrito especificado no fue encontrado");
        }
        const productIndex = cart.products.findIndex(product => product.id_prod.id === pId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return res.status(400).send(`El producto no está en el carrito`);
        }

        await cart.save();
        
        res.status(200).send(cart);
    } catch (error) {
        console.error("Error interno del servidor al actualizar producto:", error);
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`);
    }
});

cartRouter.delete('/:cid', async (req, res) => {

    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            res.status(400).send("No se encontro el carrito");
            }

        cart.products = [];

        await cart.save();
        res.status(200).send("El carrito se vacio correctamente");
    } catch (error) {
        res.status(500).send(`Error interno del servidor al limpiar carrito: ${error}`);
    }
});

export default cartRouter;
