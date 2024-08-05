import productModel from '../models/product.js';

export const home = async (req, res) => {
    try {
        const productos = await productModel.find();
        res.render('home', {
            mostrarProductos: productos.length > 0,
            productos
        });
    } catch (error) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send('Error al obtener productos');
    }
};
