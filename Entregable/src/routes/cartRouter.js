import { Router } from "express";
import { createCart, deleteProduct, getCart, insertProductCart, updateCart, updateProductToCart, cleanCart, createTicket } from "../controllers/cartController.js";

const cartRouter = Router();

cartRouter.post('/', createCart)

cartRouter.get('/:cid', getCart);

cartRouter.post('/:cid/:pid', passport.authenticate('jwt',{session: false}), insertProductCart);

cartRouter.delete('/:cid/products/:pid', deleteProduct);

cartRouter.put('/:cid', updateCart);

cartRouter.put('/:cid/products/:pid', updateProductToCart );

cartRouter.delete('/:cid', cleanCart );

cartRouter.post('/:cid/purchase', )

export default cartRouter;
