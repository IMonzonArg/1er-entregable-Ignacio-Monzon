import { promises as fs } from 'fs';
import path from 'path';

class ProductManager {
    constructor(filePath) {
        this.path = path.join(process.cwd(), filePath);
        this.initFile();
    }

    async initFile() {
        try {
            await fs.access(this.path);
        } catch (error) {
            console.log(`Archivo ${this.path} no encontrado. Creando un nuevo archivo`);
            await fs.writeFile(this.path, '[]');
        }
    }

    async addProduct(nuevoProducto) {
        const products = await this.getProducts();

        if (
            nuevoProducto.title &&
            nuevoProducto.description &&
            nuevoProducto.price &&
            nuevoProducto.thumbnail &&
            nuevoProducto.code &&
            nuevoProducto.stock
        ) {
            const productoExistente = products.find(
                (producto) => producto.code === nuevoProducto.code
            );

            if (!productoExistente) {
                const newProduct = {
                    id: products.length + 1,
                    title: nuevoProducto.title,
                    description: nuevoProducto.description,
                    price: nuevoProducto.price,
                    thumbnail: nuevoProducto.thumbnail,
                    code: nuevoProducto.code,
                    stock: nuevoProducto.stock,
                };

                products.push(newProduct);
                await fs.writeFile(this.path, JSON.stringify(products, null, 2));
                return { success: true, message: "Producto agregado correctamente" };
            } else {
                return { success: false, message: "El producto ya existe. No se puede agregar." };
            }
        } else {
            return { success: false, message: "Faltan campos requeridos. No se puede agregar el producto." };
        }
    }

    async getProducts() {
            const filesContent = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(filesContent);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(producto => producto.id === Number(id));
        if (product) {
            return product;
        } else {
            return 'Producto no existente';
        }
    }

    async getProductById(id) {
        const productId = Number(id);
    
        if (isNaN(productId)) {
            return 'ID no válido';
        }
    
        const products = await this.getProducts();
        const product = products.find(producto => producto.id === productId);
    
        return product || 'Producto no existente';
    }
        

    async updateProduct(id, updatedData) {
        const products = await this.getProducts();
        const indexToUpdate = products.findIndex((product) => product.id === id);

        if (indexToUpdate !== -1) {
            products[indexToUpdate] = { ...products[indexToUpdate], ...updatedData };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return { success: true, message: "Producto actualizado correctamente" };
        }
        return { success: false, message: "El producto no pudo ser actualizado" };
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const updatedProducts = products.filter((product) => product.id !== id);
        await fs.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));
    }
}

export { ProductManager };
