import { request, response } from 'express';
import productManager from '../../managers/product.manager.js';

//reglas de tipo de datos para los campos
const fieldRules = {
  title: 'string',
  description: 'string',
  code: 'string',
  price: 'number',
  stock: 'number',
  category: 'string',
  thumbnail: 'object',
};

//funcion para ver que los tipos de datos esten bien
function matchesFieldType(body, rules) {
  let error = '';
  for (let attribute in rules) {
    //recorro los attributos en rules (fieldRules), Si no está el campo va a devolver 'undefined'
    if (
      (typeof body[attribute] !== rules[attribute] &&
        typeof body[attribute] !== 'undefined') ||
      body[attribute] === ''
    ) {
      //Se invalida si encuentra el primer tipo de dato que no coincida
      if (body[attribute] === '') {
        error = `Error ${attribute} debe ser ${rules[attribute]} y no puede estar vacío`;
      } else {
        error = `Error ${attribute} debe ser ${rules[attribute]}`;
      }
      return error;
    }
  }

  //verifico si los datos que vienen en el body estan en rules (campos de product), si envian uno que no este no hago el update
  for (let attribute in body) {
    // console.log(attribute);
    if (!rules.hasOwnProperty(attribute))
      error = `Error  producto no tiene el atribute ${attribute}`;
  }
  return error;
}

export const checkProductFields = async (
  req = request,
  res = response,
  next
) => {
  try {
    // verifica tipo de datos
    let error = matchesFieldType(req.body, fieldRules);
    if (error)
      return res.status(400).json({
        status: 'Error',
        msg: error,
      });
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'Error', msg: 'Error interno del servidor' });
  }
};
