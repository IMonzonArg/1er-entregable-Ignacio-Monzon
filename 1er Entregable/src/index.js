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
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.set("views", path.join(__dirname, "views")); 


app.get('/static', (req, res) => {

    const prods = [
        {id: 1, title: "Arco 1", price: 1500, img:"https://http2.mlstatic.com/D_NQ_NP_716401-MLA71435395465_082023-O.webp"},
        {id: 2, title: "Arco 2", price: 1900, img:"https://http2.mlstatic.com/D_NQ_NP_786538-MLA69037977342_042023-O.webp", },
        {id: 3, title: "Arco 3", price: 2100, img:"https://http2.mlstatic.com/D_NQ_NP_756366-MLA31613450441_072019-O.webp"},
        {id: 4, title: "Arco 4", price: 3600, img:"https://http2.mlstatic.com/D_NQ_NP_861798-MLA72303737529_102023-O.webp"}
    ]

    res.render('products', {
        mostrarProductos: true,
        productos: prods,
        css: 'products.css'
    });
});

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
