import { Router } from "express";
import {
    createCart,
    insertProductCart,
    deleteProduct,
    getCart,
    createTicket,
    updateCart,
    updateProductToCart,
    cleanCart
} from "../controllers/cartController.js";
import passport from "passport";

const cartRouter = Router();

cartRouter.post('/', createCart);
cartRouter.get('/:cid', passport.authenticate('jwt', { session: false }), getCart);
cartRouter.post('/:cid/:pid', passport.authenticate('jwt', { session: false }), insertProductCart);
cartRouter.delete('/:cid/:pid', passport.authenticate('jwt', { session: false }), deleteProduct);
cartRouter.put('/:cid', passport.authenticate('jwt', { session: false }), updateCart);
cartRouter.put('/:cid/:pid', passport.authenticate('jwt', { session: false }), updateProductToCart);
cartRouter.delete('/:cid', passport.authenticate('jwt', { session: false }), cleanCart);
cartRouter.get('/purchase/:cid', passport.authenticate('jwt', { session: false }), createTicket);

export default cartRouter;
