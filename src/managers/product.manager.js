let products = [];
//importante en el archivo json dejar [] para que no falle en fs
import fs from 'fs';
import { uuid } from 'uuidv4'; //cuando usemos mongo borrarlo
const pathFile = './src/jsonDB/products.json';

//AGREGAR PRODUCTO *************************************
const addProduct = async (product) => {
  await getProducts(); //obtengo todos los productos

  //desestructuro producto
  const { title, description, price, thumbnail, code, stock, category } =
    product;

  //creo el nuevo procucto uuidv4 es un generador de uuid
  //agrego thumbnail o lo dejo vacio si no viene
  const newProduct = {
    pid: uuid(),
    title,
    description,
    price,
    thumbnail: thumbnail || [],
    code,
    stock,
    category,
    status: true,
  };
  products.push(newProduct); //agrego el prod a productos
  await fs.promises.writeFile(pathFile, JSON.stringify(products)); //lo grabo en el json

  return newProduct; //devuelvo el prod creado
};

//OBTENER PRODUCTOS *************************************
const getProducts = async (limit) => {
  const productsJson = await fs.promises.readFile(pathFile, 'utf-8'); //leo el archivo y obtengo el productos
  const productsParse = JSON.parse(productsJson); //parseo los prod
  products = productsParse || []; //si no vienen nada lo dejo en blanco

  if (!limit) return products; //si no viene limit devuelvo todos

  return products.slice(0, limit); //si viene con limit corto el array hasta el limit
};

//OBTENER PRODUCTO POR PID *************************************
const getProductById = async (pid) => {
  products = await getProducts(); //obtengo todos los productos
  const product = products.find((prod) => prod.pid === pid); //busco el que me vino por parm

  return product;
};

//MODIFICAR PRODUCTO *************************************
const updateProduct = async (pid, productData) => {
  await getProducts(); //obtengo todos los prod

  const index = products.findIndex((p) => p.pid === pid); //busco el producto

  //reemplazo los valores por los que vinieron por parm
  products[index] = {
    ...products[index],
    ...productData,
  };

  //guardo en archivo
  await fs.promises.writeFile(pathFile, JSON.stringify(products));
  const product = await getProductById(pid); //obtengo el producto para luego mostrarlo
  return product;
};

//BORRAR PRODUCTO *************************************
const deleteProduct = async (pid) => {
  await getProducts(); //obtengo todos los prod
  const product = await getProductById(pid); //busco el que quiero borrar
  if (!product) return false; //si lo encuentra
  products = products.filter((p) => p.pid !== pid); //hago filter para quitarlo del array

  await fs.promises.writeFile(pathFile, JSON.stringify(products)); //grabo el nuevo array

  return true;
};

//exporto metodos
export default {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
