import cartModel from "../models/cart.js"
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js" 

export const getCart = async (req,res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id: cartId});
        res.status(200).send(cart);
    } catch(error){
        req.logger.fatal(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
}

export const createCart = async (req,res) => {
    try{
        const newCartId = await  cartModel.create({products: []});
        res.status(201).send({id: newCartId})
    } catch(error){
        req.logger.fatal(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
        res.status(500).send( `Error interno del servidor al crear un nuevo carrito: ${error}`)
    }
}

export const insertProductCart = async (req,res) => {
    try {
        if (req.user.rol == "Admin"){
            
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
        } else {
            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        req.logger.fatal(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
    }
}

export const deleteProduct = async (req, res) => {
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
        req.logger.fatal(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`);
    }
}

export const updateCart = async (req, res) => {
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
        req.logger.error(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error interno del servidor al actualizar el carrito: ${error}`);
    }
}

export const updateProductToCart = async (req, res) => {
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
        req.logger.error(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`);
    }
}

export const cleanCart = async (req, res) => {

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
        req.logger.fatal(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error interno del servidor al limpiar carrito: ${error}`);
    }
}

export const createTicket = async (req, res) => {
    try {     
        const cartId = req.params.pid;
        const cart = await cartModel.findById(cartId);
        const prodSinStock = []
        
        if(cart) {
            cart.products.forEach(async (prod) => {
                let producto = await productModel.findById(prod.id_prod)
                if(producto.stock - prod.quantity < 0 ) {
                    prodSinStock.push(producto.id)
                }
        })
            if(prodSinStock.length == 0) {
            //const totalPrice = cart.products.reduce((a,b) => (a.id_prod.price * a.quantity) + (b.id_prod.price * b.quantity), 0) 
            const aux = [...cart.products]
            const newTicket = await ticketModel.create({
                code: crypto.randomUUID(),
                purchaser: req.user.email,
                ammount: totalPrice,
                products: cart.products
            })
            cart.products.forEach(async (prod) => {
            /*await productModel.findByIdAndUpdate(prod.id_prod, {
                stock: stock - prod.quantity
                })*/
            })
            await cartModel.findByIdAndUpdate(cartId,{
                products: []
            })
            res.status(200).send(newTicket)
        } else {
            prodSinStock.forEach((prodId) => {
                cart.products = cart.products.filter (pro => pro.id_prod !== prodId)
            })
            await cartModel.findByIdAndUpdate(cartId,{
                products: cart.products
            }) 
            res.status(400).send(`Productos sin stock: ${prodSinStock}`)
        }
    } else {
        res.status(404).send("Carrito no existe")
    }
        res.status(200).send(newTicket)
    } catch (e){
        req.logger.fatal(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(e)
    }

}