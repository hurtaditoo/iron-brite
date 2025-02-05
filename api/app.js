require('dotenv').config(); // Mira en la raíz de la app y busca el fichero .env y carga las variables de entorno de su interior
const express = require('express');
const logger = require('morgan');

/* DB init */
require('./config/db.config');  // Con esto se conecta a la base de datos

const app = express();

/* Middlewares */
app.use(express.json()); // Con esto se puede recibir JSON en las peticiones
app.use(logger('dev')); // logger('dev') muestra por consola las peticiones que se hacen al servidor
app.use((req, res, next) => { // req es de request (lleva toda la info del http) y res de response
  console.log('HOLIIIIIIIIIII');
  next(); // Si no pongo next no se ejecuta el siguiente middleware
})

/* API Routes Configuration */
const routes = require('./config/routes.config');
app.use('/api/v1/', routes);  // use es para que se ejecute siempre que se haga una petición, el v1 es para versionar la api


const port = Number(process.env.PORT || 3000);  // port es un STRING, con Number se convierte || esto se usa en caso de que PORT no esté definido, aunq tb vale '??'
app.listen(port, () => console.info(`Application running at port ${port}`));