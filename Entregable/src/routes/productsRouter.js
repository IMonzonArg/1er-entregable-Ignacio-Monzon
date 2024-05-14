import { Router } from "express";
import passport from "passport";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js"; 

const productsRouter = Router()

    productsRouter.get('/', getProducts);

    productsRouter.get('/:pid', getProduct);
    
    productsRouter.post('/', createProduct);

    productsRouter.put('/:pid', updateProduct);

    productsRouter.delete('/:id', deleteProduct);

export default productsRouter