import crypto from "crypto";

// class ProductManager {
//     constructor(title, description, price, thumbnail, code, stock) {
//         this.title = title;
//         this.description = description;
//         this.price = price;
//         this.thumbnail = thumbnail;
//         this.code = code;
//         this.stock = stock || [];
//         this.products = [];
//     }

//     addProduct(nuevoProducto) {
//         if (
//             nuevoProducto.title &&
//             nuevoProducto.description &&
//             nuevoProducto.price &&
//             nuevoProducto.thumbnail &&
//             nuevoProducto.code &&
//             nuevoProducto.stock
//         ) {
//             console.log("Los campos ingresados son correctos");

//             const indice = this.products.findIndex(
//                 (producto) => producto.code === nuevoProducto.code
//             );

//             if (indice !== -1) {
//                 return "Producto ya existente";
//             } else {
//                 nuevoProducto.id = crypto.randomBytes(5).toString("hex");
//                 this.products.push(nuevoProducto);
//                 console.log("Se ha agregado un nuevo producto a la lista");
//             }
//         } else {
//             console.log(
//                 "Alguno de los campos está cargado de manera incorrecta o está vacío"
//             );
//         }
//     }

//     getProducts() {
//         return this.products;
//     }
//     getProductsById(id) {
//         if (id) {
//             const producto = this.products.find(
//                 (producto) => producto.id === id
//             );
//             if (producto) {
//                 console.log(producto);
//             } else {
//                 throw new Error("Not found");
//             }
//         } else {
//             console.log("ID no proporcionado");
//         }
//     }
    
// }

// const manager = new ProductManager();
// const nuevoProducto = {
//     title: "producto prueba",
//     description: "Este es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: 25
// };

// manager.addProduct(nuevoProducto);

// console.log("Array con nuevo producto", manager.getProducts());

// const nuevoProducto2 = {
//     title: "producto prueba",
//     description: "Este es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: 25
// };

// manager.addProduct(nuevoProducto2);

// const productId = manager.getProducts()[0].id;

// try {
//     const productoEncontrado = manager.getProductsById(productId);
//     console.log("Producto encontrado:", productoEncontrado);
// } catch (error) {
//     console.error("Error al buscar producto:", error.message);
// }

// const idInexistente = "idInexistente";
// try {
//     const productoInexistente = manager.getProductsById(idInexistente);
//     console.log("Producto encontrado:", productoInexistente);
// } catch (error) {
//     console.error("Error al buscar producto:", error.message);
// }

import {promises as fs} from 'fs'
const  ROUTE = './productos.json'
const products = this.getProducts();

class ProductManager {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock || [];
        this.products = [];
        this.path = './productos.json'
    }

addProduct = async (product) => {

    let products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));


    const index = products.findIndex((prod) => prod.id === product.id);
    if (index !== -1) {
        products[index].cant += product.cant;
    } else {
        products.push(product);
    }

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

}

getProducts() {
    const filesContent = fs.readFileSync (this.path, 'utf-8');
    return JSON.parse(filesContent);
} 

getProductById() {

    return products.find(product => product.id === id)
}

updateProduct(id, updatedData) {
    const products = this.getProducts();
    const indexToUpdate = products.findIndex(product => product.id === id);

    if (indexToUpdate !== -1) {
        products[indexToUpdate] = { ...products[indexToUpdate], ...updatedData };

        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    }
}
deleteProduct(id) {
    const products = this.getProducts();
    const updatedProducts = products.filter(product => product.id !== id);

    fs.writeFileSync(this.path, JSON.stringify(updatedProducts, null, 2));
}
}

const productManager = new ProductManager('ruta/del/archivo.json');

const newProduct = {
    title: 'Nuevo Producto',
    description: 'Descripción del nuevo producto',
    price: 100,
    thumbnail: 'ruta/imagen.jpg',
    code: 'ABC123',
    stock: 10
};

productManager.addProduct(newProduct);

const allProducts = productManager.getProducts();
console.log(allProducts);

const productIdToUpdate = 1;
const updatedData = { price: 120, stock: 15 };
productManager.updateProduct(productIdToUpdate, updatedData);

const productById = productManager.getProductById(productIdToUpdate);
console.log(productById);

const productIdToDelete = 2;
productManager.deleteProduct(productIdToDelete);
