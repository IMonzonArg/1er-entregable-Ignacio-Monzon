import crypto from 'crypto';
import { promises as fs } from 'fs';

class CartManager {
    constructor(path){
        this.id = crypto.randomBytes(10).toString('hex');
        this.path = path; 
    }

    async getCart() {
        const cartContent = await fs.readFile(this.path, 'utf-8');
        const cart = JSON.parse(cartContent);
        return cart;
    }

    async addProductByCart(id, quantityParam) {
        const cartContent = await fs.readFile(this.path, 'utf-8');
        const cart = JSON.parse(cartContent);

        const indice = cart.findIndex(productoCart => productoCart.id === id);

        if (indice !== -1) {
            cart[indice].quantity += quantityParam;
        } else {
            const prod = { id: id, quantity: quantityParam };
            cart.push(prod);
        }
        await fs.writeFile(this.path, JSON.stringify(cart, null, 2));
        return "Producto cargado correctamente";
    }
}

export { CartManager };
