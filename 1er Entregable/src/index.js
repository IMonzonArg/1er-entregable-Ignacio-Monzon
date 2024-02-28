import express from 'express';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import { engine } from 'express-handlebars';
import __dirname from './path.js'; 
import { Server } from 'socket.io'; 
import path from 'path';
import upload from './config/multer.js';

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

const io = new Server(server);

app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'public'))); 
app.use('/api/products', productsRouter, express.static(path.join(__dirname, 'public')));
app.use('/api/cart', cartRouter);
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.set("views", path.join(__dirname, "views")); 

io.on('connection', (socket) => {
    console.log("Conexio con Socket.io");

    socket.on('movimiento', info => {
        console.log(info);
    });

    socket.on('rendirse', info => {
        console.log(info);
        socket.emit('mensaje-jugador', "Te has rendido");
        socket.broadcast.emit('rendicion', "El jugador se rindio");
    });
});

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
