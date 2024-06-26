// Imports de módulos y configuraciones
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import path from 'path';
import upload from './config/multer.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import sessionRouter from './routes/sessionRouter.js';
import messageModel from  './models/messages.js';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';
import initializePassport from './config/passport/passport.js';
import { faker } from '@faker-js/faker'
import varenv from './config/dotenv.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io'; 
import __dirname from './path.js'; 
import { addLoger } from './utils/logger.js';




// -----------------------------------------------------------------------------------------------------------------
// Configuraciones o declaraciones
const app = express();
const PORT = 8080;
const games = []
const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion de mi aplicacion',
            description: 'Descripcion de documentacion'
        },
        apis: [`${__dirname}/docs/**/*.yaml`]
    }
}

mongoose.connect(`mongodb+srv://ignaciolmonzon:@cluster0.hkfjh1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

const specs = swaggerJSDoc(swaggerOptions)

// -----------------------------------------------------------------------------------------------------------------
// Middleware para analizar el cuerpo de la solicitud
app.use(express.json());
app.use(addLoger)
app.use(session({
    secret: varenv.session_secret,
    resave: true,
    store: MongoStore.create({
        mongoUrl: varenv.mongo_url,        
        ttl: 100
    }),
    saveUninitialized:true
}))
app.use(cookieParser(varenv.cookies_secret));


// -----------------------------------------------------------------------------------------------------------------
// Configuración del servidor y conexión a la base de datos
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

const io = new Server(server);

mongoose.connect(varenv.mongo_url)
.then(()=> console.log("DB is connected"))
.catch(e=>console.log(e));

// -----------------------------------------------------------------------------------------------------------------
// Configuración de las rutas
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use('/api/cart', cartRouter);
app.use('/api/users', userRouter);
app.use('/static', express.static(path.join(__dirname, 'public'))); 
app.use('/api/products', productsRouter, express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    console.log(req.body);
    next();
});
app.use('/api/session', sessionRouter)


// -----------------------------------------------------------------------------------------------------------------
// Routes para cookies
app.get('/setCookie',(req,res) => {
    res.cookie('CookieCookie', 'Esto es una cookie', {maxAge: 3000000}).send("Cookie Creada");
});

app.get('/getCookie',(req,res) => {
    res.send(req.cookies);
});

app.get('/deleteCookie', (req,res) => {
    res.clearCookie('CookieCookie').send("Cookie Borrada");
});

// -----------------------------------------------------------------------------------------------------------------
// Session
app.get('/session', (req,res) => {
    if(req.session.counter) {
        req.session.counter++;
        res.send(`Sos el usuario N° ${req.session.counter} en ingresar a la pagina `)
    }else {
        req.session.counter = 1
        res.send("Sos el primer usuario en la web")
    }
});

app.post('/login', (req,res) => {
    const {email, password} = req.body

    if(email == "admin@admin.com" && password == "1234") {
        req.session.email = email
        req.session.password = password
    } 
    console.log(req.session)
    res.send("Login")
})

// -----------------------------------------------------------------------------------------------------------------
// Configuración del motor de plantillas Handlebars
app.set('view engine', 'handlebars');
app.engine('handlebars', engine());
app.set("views", path.join(__dirname, "views")); 

initializePassport()
    app.use(passport.initialize()),
    app.use(passport.session())



// -----------------------------------------------------------------------------------------------------------------
// Configuración de Socket.io
io.on('connection', (socket) => {
    console.log("Conexión con Socket.io");

    socket.on('mensaje', async (mensaje) => {
        try {
            await messageModel.create(mensaje);
            const mensajes = await messageModel.find();
            console.log(mensaje);
            io.emit('mensajeLogs', mensajes);
        } catch(e) {
            io.emit('mensajeLogs', e);
        }
    });
});

// -----------------------------------------------------------------------------------------------------------------
// Ruta para manejar la subida de archivos
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file);
        res.status(200).send("Imagen cargada correctamente");
    } catch (error) {
        req.logger.error(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
        res.status(500).send({ message: "Error al subir la imagen" });
    }
});

// -----------------------------------------------------------------------------------------------------------------
// Mocks de juegos

const createRandomGame = () => {
    return {
        username : faker.commerce.product(),
        description: faker.commerce.productDescription(),
        number: faker.number.int({ max: 100 }),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(),
        code: faker.string.uuid(),
        price: faker.commerce.price({ min: 100, max: 200 }),

    }
}

for (let i = 0; i < 100; i++) {
    games.push(createRandomGame())
}

app.get('/mockingproducts', (req, res) => {
    res.json(games);
});

// -----------------------------------------------------------------------------------------------------------------
// Logger

app.get('/loggerTest', (req, res) => {
    try {
        req.logger.fatal('Este es un error fatal para testeos de fatal');
        // Log an error
        req.logger.error('Este es un error fatal para testeos de error');

        res.status(200).send('Los errores fueron almacenados en el logger');
    } catch (error) {
        res.status(500).send('Error al loggear los tests');
    }
});


export default app;
