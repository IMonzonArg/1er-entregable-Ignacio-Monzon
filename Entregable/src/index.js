import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import path from 'path';
import { uploadProds, uploadDocs, uploadPerfs } from './config/multer.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import sessionRouter from './routes/sessionRouter.js';
import messageModel from './models/messages.js';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';
import initializePassport from './config/passport/passport.js';
import { Server } from 'socket.io';
import __dirname from './config/path.js';
import { addLogger } from './utils/logger.js';
import adminRouter from './routes/adminRouter.js';
import homeRouter from './routes/homeRouter.js';
import chatRouter from './routes/chatRouter.js';
import multerRouter from './routes/multerRouter.js';
import varenv from './config/dotenv.js';
import { create } from 'express-handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';

// -----------------------------------------------------------------------------------------------------------------
// Configuraciones o declaraciones
const app = express();
const PORT = 8080;
const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion de mi aplicacion',
            description: 'Descripcion de documentacion'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

// Conexión a la Base de Datos
mongoose.connect(varenv.mongo_url)
    .then(() => console.log("DB is connected"))
    .catch(e => console.log(e));

const specs = swaggerJSDoc(swaggerOptions);

// -----------------------------------------------------------------------------------------------------------------
// Middleware para analizar el cuerpo de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addLogger);
app.use(session({
    secret: varenv.session_secret,
    resave: true,
    store: MongoStore.create({
        mongoUrl: varenv.mongo_url,
        ttl: 100
    }),
    saveUninitialized: true
}));
app.use(cookieParser(varenv.cookies_secret));
app.use(express.static(path.join(__dirname, 'public')));

// -----------------------------------------------------------------------------------------------------------------
// Configuración del servidor y conexión a la base de datos
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

const io = new Server(server);

// -----------------------------------------------------------------------------------------------------------------
// Configuración del motor de plantillas Handlebars
const hbs = create({
    extname: '.hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: path.join(__dirname, 'src', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'src', 'views', 'partials'),
    allowProtoPropertiesByDefault: true
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'));


// -----------------------------------------------------------------------------------------------------------------
// Passport

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// -----------------------------------------------------------------------------------------------------------------
// Configuración de las rutas
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use('/api/cart', cartRouter);
app.use('/api/users', userRouter);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/api/products', productsRouter);
app.use('/api/session', sessionRouter);
app.use('/admin', adminRouter);
app.use('/chat', chatRouter);
app.use('/multer', multerRouter);
app.use('/', homeRouter);

// -----------------------------------------------------------------------------------------------------------------
// Rutas para cookies
app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es una cookie', { maxAge: 3000000 }).send("Cookie Creada");
});

app.get('/getCookie', (req, res) => {
    res.send(req.cookies);
});

app.get('/deleteCookie', (req, res) => {
    res.clearCookie('CookieCookie').send("Cookie Borrada");
});

// -----------------------------------------------------------------------------------------------------------------
// Session
app.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Sos el usuario N° ${req.session.counter} en ingresar a la pagina`);
    } else {
        req.session.counter = 1;
        res.send("Sos el primer usuario en la web");
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@admin.com" && password === "1234") {
        req.session.email = email;
        req.session.password = password;
    }
    res.send("Login");
});

// -----------------------------------------------------------------------------------------------------------------
// Configuración de Socket.io
io.on('connection', (socket) => {

    socket.on('mensaje', async (mensaje) => {
        try {
            await messageModel.create(mensaje);
            const mensajes = await messageModel.find();
            io.emit('mensajeLogs', mensajes);
        } catch (e) {
            io.emit('mensajeLogs', e);
        }
    });
});

// -----------------------------------------------------------------------------------------------------------------
// Ruta para manejar la subida de archivos
app.post('/upload/products', uploadProds.single('product'), (req, res) => {
    try {
        res.status(200).send("Imagen de producto cargada correctamente");
    } catch (error) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send({ message: "Error al subir la imagen de producto" });
    }
});

app.post('/upload/docs', uploadDocs.single('docs'), (req, res) => {
    try {
        res.status(200).send("Documento cargado correctamente");
    } catch (error) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send({ message: "Error al subir el documento" });
    }
});

app.post('/upload/profiles', uploadPerfs.single('profile'), (req, res) => {
    try {
        res.status(200).send("Imagen de perfil cargada correctamente");
    } catch (error) {
        req.logger.error(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send({ message: "Error al subir la imagen de perfil" });
    }
});

// -----------------------------------------------------------------------------------------------------------------
// Logger
app.get('/loggerTest', (req, res) => {
    try {
        req.logger.fatal('Este es un error fatal para testeos de fatal');
        req.logger.error('Este es un error fatal para testeos de error');

        res.status(200).send('Los errores fueron almacenados en el logger');
    } catch (error) {
        res.status(500).send('Error al loggear los tests');
    }
});

export default app;
