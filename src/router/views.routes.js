import { Router } from 'express';
import productManager from '../managers/product.manager.js';
import { io } from '../app.js'; //para websockets

const router = Router();

//INDEX, la raiz solo renderiza el index
router.get('/', async (req, res) => {
  try {
    res.render('index');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//TRABAJA CON PROD EN TIEMPO REAL
router.get('/realtimeproducts', async (req, res) => {
  try {
    //primero traigo los productos, luego muestro que se conecto y recien ahi hago el emit de productos, de esa forma se renderiza bien al cargar realtimeproducts
    const products = await productManager.getProducts();
    io.on('connection', (socket) => {
      console.log('Cliente conectado');
      io.emit('products', products);
    });

    res.render('realTimeProducts');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//MUESTRA LOS PROD EN TIEMPO REAL
router.get('/home', async (req, res) => {
  try {
    io.on('connection', (socket) => {
      console.log('Cliente conectado');
    });
    const products = await productManager.getProducts();
    io.emit('products', products);
    res.render('home', { products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//AGREGA UN PROD
router.post('/realtimeproducts', async (req, res) => {
  try {
    const { title, price, description } = req.body;
    await productManager.addProduct({ title, price, description });
    const products = await productManager.getProducts();
    io.emit('products', products);
    res.render('realTimeProducts');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//ELIMINAR UN PROD
router.delete('/realtimeproducts', async (req, res) => {
  try {
    const { id } = req.body;
    // await productManager.deleteProduct(Number(id));
    await productManager.deleteProduct(id); //uso un uuid no numerico
    const products = await productManager.getProducts();
    io.emit('products', products); //mando los productos
    res.render('realTimeProducts');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
