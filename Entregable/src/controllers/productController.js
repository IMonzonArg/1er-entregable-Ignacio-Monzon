import productModel from '../models/product.js';

export const getProducts = async (req, res) => {
    try {
        const { limit, page, filter, ord } = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const limi = limit !== undefined ? limit : 10;

        if (filter === "true" || filter === "false") {
            metFilter = "status";
        } else {
            if (filter !== undefined) metFilter = "category";
        }

        const query = metFilter !== undefined ? { [metFilter]: filter } : {};
        const ordQuery = ord !== undefined ? { price: ord } : {};

        const prods = await productModel.paginate(query, { limit: limi, page: pag, sort: ordQuery });
        res.render('products', { products: prods.docs });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const prod = await productModel.findById(id);
        if (prod) {
            res.status(200).send(prod);
        } else {
            req.logger.warning(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(404).send('No se ha encontrado el producto');
        }
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al consultar producto: ${error.message}`);
    }
};

export const createProduct = async (req, res) => {
    try {
        if (req.user.rol === "Admin") {
            const prod = req.body;
            const message = await productModel.create(prod);
            res.status(201).send(message);
        } else {
            req.logger.warning(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(403).send("Usuario no autorizado");
        }
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al crear producto: ${error.message}`);
    }
};

export const updateProduct = async (req, res) => {
    try {
        if (req.user.rol === "Admin") {
            const { id } = req.params;
            const prodUpdate = req.body;
            const prod = await productModel.findByIdAndUpdate(id, prodUpdate, { new: true });
            res.status(200).send(prod);
        } else {
            req.logger.warning(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(403).send("Usuario no autorizado");
        }
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error.message}`);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        if (req.user.rol === "Admin") {
            const { id } = req.params;
            const message = await productModel.findByIdAndDelete(id);
            res.status(200).send(message);
        } else {
            req.logger.warning(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(403).send("Usuario no autorizado");
        }
    } catch (error) {
        req.logger.fatal(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error.message}`);
    }
};
