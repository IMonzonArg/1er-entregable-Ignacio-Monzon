import { Router } from "express";
import { login, register, sessionGithub, logout, testJWT, sendEmailPassword, changePassword } from "../controllers/sessionController.js";
import passport from "passport";

const sessionRouter = Router();

// Rutas de autenticación
sessionRouter.get('/login', (req, res) => res.render('login')); 
sessionRouter.post('/login', passport.authenticate('login'), login);

sessionRouter.get('/register', (req, res) => res.render('register')); 
sessionRouter.post('/register', passport.authenticate('register'), register);

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
sessionRouter.get('/githubSession', passport.authenticate('github'), sessionGithub);

// Rutas de sesión
sessionRouter.get('/logout', logout);

// Rutas de JWT
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), testJWT);
sessionRouter.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.status(200).send("usuario logueado");
});

// Rutas de restablecimiento de contraseña
sessionRouter.post('/reset-password/:token', changePassword);
sessionRouter.post('/sendEmailPassword', sendEmailPassword);

export default sessionRouter;
