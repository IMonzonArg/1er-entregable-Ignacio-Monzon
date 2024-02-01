import { promises as fs } from 'fs';

class ProductManager {
    constructor() {
        this.path = './productos.json';
        this.initFile();
    }

    async initFile() {
        try {
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, '[]');
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = {
            id: products.length + 1,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
        };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }
    

    async getProducts() {
        const filesContent = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(filesContent);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find((product) => product.id === id);
    }

    async updateProduct(id, updatedData) {
        const products = await this.getProducts();
        const indexToUpdate = products.findIndex(product => product.id === id);
    
        if (indexToUpdate !== -1) {
            products[indexToUpdate] = { ...products[indexToUpdate], ...updatedData };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        }
    }
    

    async deleteProduct(id) {
        const products = await this.getProducts();
        const updatedProducts = products.filter(product => product.id !== id);
        await fs.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));
    }
    
}

const productManager = new ProductManager();

const newProduct = {
    title: 'Nuevo Producto',
    description: 'Descripción del nuevo producto',
    price: 100,
    thumbnail: 'ruta/imagen.jpg',
    code: 'ABC123',
    stock: 10,
};

productManager.addProduct(newProduct);


