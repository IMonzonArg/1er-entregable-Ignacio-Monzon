import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productModel from '../models/product.js'; 

dotenv.config();

const mongoUrl = process.env.MONGO_BD_URL;

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Conectado a la base de datos');
    seedProducts();
  })
  .catch((err) => console.error('Error conectando a la base de datos', err));

const products = [
    {
        title: "Arc Artemis",
        description: "Un arco recurvo de alta precisión para caza.",
        stock: 10,
        category: "Arcos Recurvos",
        status: true,
        code: "ARC-001",
        price: 25000,
        thumbnail: ["ruta/a/la/imagen1.jpg"]
    },
    {
        title: "Arc Apollo",
        description: "Un arco compuesto robusto y duradero.",
        stock: 5,
        category: "Arcos Compuestos",
        status: true,
        code: "ARC-002",
        price: 45000,
        thumbnail: ["ruta/a/la/imagen2.jpg"]
    },
    {
        title: "Arc Diana",
        description: "Un arco tradicional para los puristas de la caza.",
        stock: 8,
        category: "Arcos Tradicionales",
        status: true,
        code: "ARC-003",
        price: 30000,
        thumbnail: ["ruta/a/la/imagen3.jpg"]
    },
    {
        title: "Arc Hermes",
        description: "Un arco ligero y rápido para disparos precisos.",
        stock: 7,
        category: "Arcos Recurvos",
        status: true,
        code: "ARC-004",
        price: 32000,
        thumbnail: ["ruta/a/la/imagen4.jpg"]
    },
    {
        title: "Arc Athena",
        description: "Un arco de competición para los más exigentes.",
        stock: 3,
        category: "Arcos Compuestos",
        status: true,
        code: "ARC-005",
        price: 50000,
        thumbnail: ["ruta/a/la/imagen5.jpg"]
    },
    {
        title: "Arc Poseidon",
        description: "Un arco diseñado para condiciones extremas.",
        stock: 6,
        category: "Arcos Tradicionales",
        status: true,
        code: "ARC-006",
        price: 48000,
        thumbnail: ["ruta/a/la/imagen6.jpg"]
    },
    {
        title: "Arc Hades",
        description: "Un arco oscuro y potente para la caza nocturna.",
        stock: 9,
        category: "Arcos Recurvos",
        status: true,
        code: "ARC-007",
        price: 27000,
        thumbnail: ["ruta/a/la/imagen7.jpg"]
    },
    {
        title: "Arc Zeus",
        description: "El arco más poderoso para los más valientes.",
        stock: 2,
        category: "Arcos Compuestos",
        status: true,
        code: "ARC-008",
        price: 60000,
        thumbnail: ["ruta/a/la/imagen8.jpg"]
    },
    {
        title: "Arc Apollo X",
        description: "Una versión avanzada del clásico Apollo.",
        stock: 4,
        category: "Arcos Compuestos",
        status: true,
        code: "ARC-009",
        price: 47000,
        thumbnail: ["ruta/a/la/imagen9.jpg"]
    },
    {
        title: "Arc Hera",
        description: "Un arco elegante y preciso para los expertos.",
        stock: 8,
        category: "Arcos Tradicionales",
        status: true,
        code: "ARC-010",
        price: 35000,
        thumbnail: ["ruta/a/la/imagen10.jpg"]
    }
];

const seedProducts = async () => {
  try {
    await productModel.deleteMany({});
    await productModel.insertMany(products);
    console.log('Productos insertados con éxito');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error insertando productos', error);
    mongoose.connection.close();
  }
};
