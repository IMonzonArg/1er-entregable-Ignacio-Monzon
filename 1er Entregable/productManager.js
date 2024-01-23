import crypto from "crypto";

class ProductManager {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock || [];
        this.products = [];
    }

    addProduct(nuevoProducto) {
        if (
            nuevoProducto.title &&
            nuevoProducto.description &&
            nuevoProducto.price &&
            nuevoProducto.thumbnail &&
            nuevoProducto.code &&
            nuevoProducto.stock
        ) {
            console.log("Los campos ingresados son correctos");

            const indice = this.products.findIndex(
                (producto) => producto.code === nuevoProducto.code
            );

            if (indice !== -1) {
                return "Producto ya existente";
            } else {
                nuevoProducto.id = crypto.randomBytes(5).toString("hex");
                this.products.push(nuevoProducto);
                console.log("Se ha agregado un nuevo producto a la lista");
            }
        } else {
            console.log(
                "Alguno de los campos está cargado de manera incorrecta o está vacío"
            );
        }
    }

    getProducts() {
        return this.products;
    }
    getProductsById(id) {
        if (id) {
            const producto = this.products.find(
                (producto) => producto.id === id
            );
            if (producto) {
                console.log(producto);
            } else {
                throw new Error("Not found");
            }
        } else {
            console.log("ID no proporcionado");
        }
    }
    
}

const manager = new ProductManager();
const nuevoProducto = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
};

manager.addProduct(nuevoProducto);

console.log("Array con nuevo producto", manager.getProducts());

const nuevoProducto2 = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
};

manager.addProduct(nuevoProducto2);

const productId = manager.getProducts()[0].id;

try {
    const productoEncontrado = manager.getProductsById(productId);
    console.log("Producto encontrado:", productoEncontrado);
} catch (error) {
    console.error("Error al buscar producto:", error.message);
}

const idInexistente = "idInexistente";
try {
    const productoInexistente = manager.getProductsById(idInexistente);
    console.log("Producto encontrado:", productoInexistente);
} catch (error) {
    console.error("Error al buscar producto:", error.message);
}



