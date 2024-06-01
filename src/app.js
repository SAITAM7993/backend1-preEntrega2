import express from 'express';
import router from './router/index.routes.js';
import viewsRouter from './router/views.routes.js';
import __dirname from './dirname.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

const PORT = 8080;
const app = express();
app.engine('handlebars', handlebars.engine()); //inicializa motor indicado con app.engine('motor que usemos', motor instanciado)
app.set('views', __dirname + '/views'); //indicamos en que parte del proy están las rutas
app.set('view engine', 'handlebars'); //indicamos que, el motor que ya inicializamos es el que queremos utilizar
// Middlewares: son operaciones que se ejecutan de manera intermedia entre la petición del cliente, y el servicio de nuestro servidor.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Configuración de carpeta para archivos estáticos

// IMPORTANTE que los middlewares se ejecuten antes de las rutas *******************************

// Rutas
app.use('/api', router);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

//Configuracion de websockets
export const io = new Server(httpServer);
