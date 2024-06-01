import fs from 'fs';
import { uuid } from 'uuidv4'; //cuando usemos mongo borrarlo
let carts = [];
const pathFile = './src/jsonDB/carts.json';

//OBTENER CARRITOS *************************************
const getCarts = async () => {
  const cartsJson = await fs.promises.readFile(pathFile, 'utf-8'); //obtengo carrito de archivo
  const cartsPars = JSON.parse(cartsJson);
  carts = cartsPars || []; //si no encuentro devuelvo vacio
  return carts;
};

//CREAR CARRITO *************************************
const createCart = async () => {
  await getCarts(); //obtengo todos los carritos
  //creo nuevo carrito - uso uuid porque si se usa el length del array cuando se borra uno quedan ids duplicados, luego cambiarlo..
  //carrito con un id y sin productos
  const newCart = {
    cid: uuid(),
    products: [],
  };

  carts.push(newCart); //agrego el nuevo carrito a carritos

  await fs.promises.writeFile(pathFile, JSON.stringify(carts)); //escribo el archivo
  return newCart;
};

//OBTENER CARRITO POR CID *************************************
const getCartById = async (cid) => {
  await getCarts(); //obtengo todos los carritos
  const cart = carts.find((c) => c.cid === cid); //busco por el cid que viene
  return cart;
};

//AGREGAR PRODUCTO A CARRITO *************************************
const addProductToCart = async (cid, pid) => {
  await getCarts(); //obtengo todos los carritos
  //AGREGAR LOGICA PARA QUE SUME...

  const index = carts.findIndex((cart) => cart.cid === cid); //busco el carrito
  const indexP = carts[index].products.findIndex((prod) => prod.pid === pid); //busco el producto en el carrito

  //si no lo encuentra lo agrego con qty 1
  if (indexP === -1) {
    const product = {
      pid: pid,
      quantity: 1,
    };

    carts[index].products.push(product); //agrego producto a carrito
  } else {
    //sino le agrego 1 a qty pasandole los index de carrito y prod
    carts[index].products[indexP].quantity += 1;
  }

  await fs.promises.writeFile(pathFile, JSON.stringify(carts)); //guardo en archivo
  return carts[index];
};

export default {
  getCarts,
  getCartById,
  addProductToCart,
  createCart,
};
