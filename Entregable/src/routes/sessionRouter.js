import { Router } from "express";
import passport from "passport";

const sessionRouter = Router()

sessionRouter.get('/login', passport.authenticate('login'), async (req, res) => {
    try{
        if(!req.user) {
            return res.status(401).send("Usuario o contraseña no validos")
        } 
        
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }

        res.status(200).send("Inicio de sesión correcto")

    } catch(e) {
        res.status(500).send("Error al loguear")
    }
})

sessionRouter.post('/register',passport.authenticate('register'), async (req,res)=>{
    try{
        if(!req.user) {
            return res.status(400).send("Usuario ya existente")
        } 
        res.status(200).send("Usuario creado correctamente")
    } catch(e){
        res.status(500).send(`Error al registrar el usuario`);
    }
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { r })

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req,res) => {
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/')
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            console.log(e)
        } else {
            res.status(200).redirect("/")
        }

    })
})

sessionRouter.get('/testJWT', passport.authenticate('jwt',{session: false}, (req,res) => {
    res.status(200).send("")
}))
sessionRouter.get('/current', passport.authenticate('jwt'), async (req, res) => {
console.log(req)
res.status(200).send("usuario logueado")
});

export default sessionRouter;