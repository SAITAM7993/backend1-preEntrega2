import { request, response } from 'express';
import productManager from '../../managers/product.manager.js';

export const checkProductAdd = async (req = request, res = response, next) => {
  try {
    const { title, description, price, code, stock, category } = req.body; //desestructuro el producto
    const newProduct = {
      title,
      description,
      price,
      code,
      stock,
      category,
    };

    const products = await productManager.getProducts(); //obtengo todos los productos

    const productExists = products.find((p) => p.code === code); // Valida que no se repita el campo de code
    if (productExists)
      return res.status(400).json({
        status: 'Error',
        msg: `El producto con el código ${code} ya existe`,
      });

    const checkData = Object.values(newProduct).includes(undefined); // Valida que los campos obligatorios vengan
    if (checkData)
      return res
        .status(400)
        .json({ status: 'Error', msg: 'Todos los datos son obligatorios' });
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'Error', msg: 'Error interno del servidor' });
  }
};
