import { Router } from 'express';
import cartManager from '../managers/cart.manager.js';
import productManager from '../managers/product.manager.js';

const router = Router();

//CREAR CARRITO *************************************
router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createCart(); //creo carrito
    res.status(201).json({ status: 'success', cart });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'error', msg: 'Error interno del servidor' });
  }
});

//OBTENER CARRITO PRO CID *************************************
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params; //obtengo cid de los parms
    // const cart = await cartManager.getCartById(Number(cid));
    const cart = await cartManager.getCartById(cid); //cuando pasemos a mongo CAMBIAR por la lin de arriba
    if (!cart)
      return res
        .status(404)
        .json({ status: 'Error', msg: 'Carrito no encontrado' });

    res.status(200).json({ status: 'success', cart });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'error', msg: 'Error interno del servidor' });
  }
});

//OBTENER CARRITOS *************************************
router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    if (!carts)
      return res
        .status(404)
        .json({ status: 'Error', msg: 'No existen carritos' });

    res.status(200).json({ status: 'success', carts });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'error', msg: 'Error interno del servidor' });
  }
});

//AGREGAR PRODUCTO A CARRITO *************************************
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params; //obtengo cid y pid de parms

    // const product = await productManager.getProductById(Number(pid));
    //busco el producto
    const product = await productManager.getProductById(pid); //cuando pasemos a mongo CAMBIAR por la lin de arriba
    if (!product)
      return res
        .status(404)
        .json({ status: 'error', msg: 'Producto no encontrado' });

    // const cart = await cartManager.addProductToCart(Number(cid), Number(pid));
    const cart = await cartManager.addProductToCart(cid, pid); //cuando pasemos a mongo CAMBIAR por la lin de arriba
    if (!cart)
      return res
        .status(404)
        .json({ status: 'error', msg: 'Carrito no encontrado' });

    res.status(200).json({ status: 'success', cart });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'error', msg: 'Error interno del servidor' });
  }
});

export default router;
