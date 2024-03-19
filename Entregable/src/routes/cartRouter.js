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
        const cart = await cartModel.findOne({_id: cartId});
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

        const deletedProduct = cart.products.findIndex(productoCart => productoCart.id_prod.toString() === pId);

        if (deletedProduct !== -1) {
            if (parseInt(quantity) === 0) {
                cart.products.splice(deletedProduct, 1);
            } else {
                cart.products[deletedProduct].quantity = parseInt(quantity);
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

cartRouter.delete('/:cid/products/:pid', async (req, res) => {

    try {
        const pId = req.params.pid;
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId);

        const deletedProduct = cart.products.findIndex(productoCart => productoCart.id_prod.toString() === pId);

        if (deletedProduct >=  0) {
            cart.products.splice(deletedProduct, 1);
            } else {
                res.status(400).send("El producto no se encuentra en el carrito");
            }
        await cart.save();
        res.status(200).send("Producto eliminado correctamente");
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
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

        res.status(500).send(`Error interno del servidor al actualizar el carrito: ${error}`);
    }
});

//incompleto, terminar, este es el tercero
cartRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const pId = req.params.pid;
        const cartId = req.params.cid;
        const { quantity } = req.body;
        const cart = await cartModel.findById(cartId);

        const deletedProduct = cart.products.findIndex(productoCart => productoCart.id_prod.toString() === pId);

        if (deletedProduct !== -1) {
            if (parseInt(quantity) === 0) {
                cart.products.splice(deletedProduct, 1);
            } else {
                cart.products[deletedProduct].quantity = parseInt(quantity);
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

//continuar a partir de aca DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
//Esta vez, para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.



export default cartRouter;
