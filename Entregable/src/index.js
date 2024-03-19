// Imports de módulos y configuraciones
import express from 'express';
import mongoose from 'mongoose';
import messageModel from  './models/messages.js';
import path from 'path';
import upload from './config/multer.js';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io'; 
import __dirname from './path.js'; 
import cookieParser from 'cookie-parser';

// -----------------------------------------------------------------------------------------------------------------
// Creación de la aplicación Express
const app = express();
const PORT = 8080;

// -----------------------------------------------------------------------------------------------------------------
// Middleware para analizar el cuerpo de la solicitud
app.use(express.json());
app.use(cookieParser());

// -----------------------------------------------------------------------------------------------------------------
// Configuración del servidor y conexión a la base de datos
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

const io = new Server(server);

mongoose.connect("mongodb+srv://ignaciolmonzon:coderhouse01@cluster0.hkfjh1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=> console.log("DB is connected"))
.catch(e=>console.log(e));

// -----------------------------------------------------------------------------------------------------------------
// Configuración de las rutas
app.use('/api/cart', cartRouter);
app.use('/api/users', userRouter);
app.use('/static', express.static(path.join(__dirname, 'public'))); 
app.use('/api/products', productsRouter, express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    console.log(req.body);
    next();
});

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
// Session cookies
app.get('/session', (req,res) => {
    // COMPLETAR
});

// -----------------------------------------------------------------------------------------------------------------
// Configuración del motor de plantillas Handlebars
app.set('view engine', 'handlebars');
app.engine('handlebars', engine());
app.set("views", path.join(__dirname, "views")); 

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
        console.log(error);
        res.status(500).send({ message: "Error al subir la imagen" });
    }
});

export default app;
