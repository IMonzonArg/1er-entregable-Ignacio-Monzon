import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from '../models/ticket.js';
import crypto from 'crypto';

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        console.log("Cart ID (getCart):", cartId);  // Verificación de cartId
        const cart = await cartModel.findOne({ _id: cartId }).populate('products.id_prod');
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }
        res.render('cartView', { cart });
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
};

export const createCart = async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).send({ id: newCart._id });
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al crear un nuevo carrito: ${error}`);
    }
};
export const insertProductCart = async (req, res) => {
    try {
        const pId = req.params.pid;
        const cartId = req.params.cid;
        console.log("Cart ID (insertProductCart):", cartId);  // Verificación de cartId
        console.log("Product ID (insertProductCart):", pId);  // Verificación de pId
        const { quantity } = req.body;
        const cart = await cartModel.findById(cartId);

        const productIndex = cart.products.findIndex(product => product.id_prod.toString() === pId);

        if (productIndex !== -1) {
            if (parseInt(quantity) === 0) {
                cart.products.splice(productIndex, 1);
            } else {
                cart.products[productIndex].quantity = parseInt(quantity);
            }
        } else {
            cart.products.push({ id_prod: pId, quantity: parseInt(quantity) });
        }

        await cart.save();
        res.redirect(`/api/cart/${cartId}`);
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al insertar producto en el carrito: ${error}`);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const pId = req.params.pid;
        const cartId = req.params.cid;
        console.log("Cart ID (deleteProduct):", cartId);  // Verificación de cartId
        console.log("Product ID (deleteProduct):", pId);  // Verificación de pId
        const cart = await cartModel.findById(cartId);

        const productIndex = cart.products.findIndex(product => product.id_prod.toString() === pId.toString());

        if (productIndex >= 0) {
            cart.products.splice(productIndex, 1);
            await cart.save();
            res.redirect(`/api/cart/${cartId}`);
        } else {
            res.status(400).send("El producto no se encuentra en el carrito");
        }
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`);
    }
};

export const updateCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        console.log("Cart ID (updateCart):", cartId);  // Verificación de cartId
        const updatedCartData = req.body;
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).send("El carrito especificado no fue encontrado");
        }
        cart.products = updatedCartData.products;

        await cart.save();
        res.redirect(`/api/cart/${cartId}`);
    } catch (error) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al actualizar el carrito: ${error}`);
    }
};

export const updateProductToCart = async (req, res) => {
    try {
        const pId = req.params.pid.toString();
        const cartId = req.params.cid;
        console.log("Cart ID (updateProductToCart):", cartId);  // Verificación de cartId
        console.log("Product ID (updateProductToCart):", pId);  // Verificación de pId
        const { quantity } = req.body;

        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).send("El carrito especificado no fue encontrado");
        }
        const productIndex = cart.products.findIndex(product => product.id_prod.toString() === pId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return res.status(400).send(`El producto no está en el carrito`);
        }

        await cart.save();
        res.redirect(`/api/cart/${cartId}`);
    } catch (error) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`);
    }
};

export const cleanCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        console.log("Cart ID (cleanCart):", cartId);  // Verificación de cartId
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(400).send("No se encontró el carrito");
        }

        cart.products = [];
        await cart.save();
        res.redirect(`/api/cart/${cartId}`);
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al limpiar carrito: ${error}`);
    }
};

export const createTicket = async (req, res) => {
    try {
        const cartId = req.params.cid;
        console.log("Cart ID (createTicket):", cartId);  // Verificación de cartId
        const cart = await cartModel.findById(cartId);
        const prodSinStock = [];
        let totalPrice = 0;

        if (cart) {
            await Promise.all(cart.products.map(async (prod) => {
                const producto = await productModel.findById(prod.id_prod);
                if (producto.stock - prod.quantity < 0) {
                    prodSinStock.push(producto.id);
                }
                totalPrice += producto.price * prod.quantity;
            }));

            if (prodSinStock.length === 0) {
                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: totalPrice,
                    products: cart.products
                });

                await cartModel.findByIdAndUpdate(cartId, { products: [] });
                res.render('ticketView', { ticket: newTicket });
            } else {
                cart.products = cart.products.filter(pro => !prodSinStock.includes(pro.id_prod.toString()));
                await cartModel.findByIdAndUpdate(cartId, { products: cart.products });
                res.status(400).send(`Productos sin stock: ${prodSinStock}`);
            }
        } else {
            res.status(404).send("Carrito no existe");
        }
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(error);
    }
};
