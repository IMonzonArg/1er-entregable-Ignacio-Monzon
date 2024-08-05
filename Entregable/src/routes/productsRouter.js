import { Router } from "express";
import passport from "passport";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js"; 

const productsRouter = Router();

productsRouter.get('/', getProducts);

productsRouter.get('/:pid', getProduct);
    
productsRouter.post('/', passport.authenticate('jwt', { session: false }), createProduct);

productsRouter.put('/:pid', passport.authenticate('jwt', { session: false }), updateProduct);

productsRouter.delete('/:pid', passport.authenticate('jwt', { session: false }), deleteProduct);

productsRouter.get('/json', async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json(products);
    } catch (error) {
        res.status(500).send(`Error interno del servidor: ${error.message}`);
    }
});


export default productsRouter;
