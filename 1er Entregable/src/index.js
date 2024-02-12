import express from 'express';
import productsRouter from './routes/productsRouter.js';
import {__dirname} from './path.js'
import cartRouter from './routes/cartRouter.js';

console.log(__dirname)


const app = express();
const PORT = 8080;


app.use(express.json())
app.use ('/api/products', productsRouter)
app.use('/api/cart', cartRouter);
app.use('/static', express.static(__dirname + ('/public')))

    app.listen(PORT, () => {
        console.log(`Server on port ${PORT}`);
    });
