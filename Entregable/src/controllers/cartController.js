import cartModel from "../models/cart.js"

export const getCart = async (req,res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id: cartId});
        res.status(200).send(cart);
    } catch(error){
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
}

export const createCart = async (req,res) => {
    try{
        const newCartId = await  cartModel.create({products: []});
        res.status(201).send({id: newCartId})
    } catch(error){
        res.status(500).send( `Error interno del servidor al crear un nuevo carrito: ${error}`)
    }
}

export const insertProductCart = async (req,res) => {
    try {
        const pId = req.params.pid;
        const cartId = req.params.cid;
        const { quantity } = req.body;
        const cart = await cartModel.findById(cartId);

        const productToPost = cart.products.findIndex(productoCart => productoCart.id_prod.toString() === pId);

        if (productToPost !== -1) {
            if (parseInt(quantity) === 0) {
                cart.products.splice(productToPost, 1);
            } else {
                cart.products[productToPost].quantity = parseInt(quantity);
            }
        } else {
            cart.products.push({ id_prod: pId, quantity: parseInt(quantity) });
        }

        await cart.save();

        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
    }
}
