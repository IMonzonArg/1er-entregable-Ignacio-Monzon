import { Router } from "express";
import {login, register, sessionGithub, logout, testJWT } from "../controllers/sessionController.js"


const sessionRouter = Router()

sessionRouter.get('/login', passport.authenticate('login'), login)

sessionRouter.post('/register',passport.authenticate('register'), register)

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { r })

sessionRouter.get('/githubSession', passport.authenticate('github'), sessionGithub)

sessionRouter.get('/logout', logout)

sessionRouter.get('/testJWT', passport.authenticate('jwt',{session: false}), testJWT)

sessionRouter.get('/current', passport.authenticate('jwt'), async (req, res) => { res.status(200).send("usuario logueado")
});

export default sessionRouter;