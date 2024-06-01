import { request, response } from 'express';
import productManager from '../../managers/product.manager.js';

export const checkProductUpdate = async (
  req = request,
  res = response,
  next
) => {
  try {
    const { code } = req.body;
    const { pid } = req.params;
    const products = await productManager.getProducts(); //obtengo todos los productos

    const productExists = products.find((p) => p.code === code); // Valida que no se repita el campo de code

    //con esto le dejo modificar si justo le envio el mismo codigo que tenia el propio producto (ej id 1 codigo 1, si encuentro el codigo 1 en id 2 ahi le tiero el error)
    if (productExists && productExists.pid !== pid)
      return res.status(400).json({
        status: 'Error',
        msg: `El producto con el código ${code} ya existe`,
      });
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'Error', msg: 'Error interno del servidor' });
  }
};
