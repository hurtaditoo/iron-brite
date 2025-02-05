const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');

const router = express.Router();  // Crea los enrutamientos para abrir lo que le digamos después del / en la url

const events = require('../controllers/events.controller');
const users = require('../controllers/users.controller');
const sessions = require("../controllers/sessions.controller");
const auth = require("../middlewares/session.middleware");

router.get("/events", auth.checkSession, events.list);  // el param debe estar en plural siempre
router.post("/events", auth.checkSession, events.create); // el auth es un middleware que se ejecuta antes de que se ejecute el controlador y sirve para comprobar si el usuario está logueado
router.get("/events/:id", auth.checkSession, events.detail);
router.delete("/events/:id", auth.checkSession, events.delete);
router.patch("/events/:id", auth.checkSession, events.update);

// Con esto se crean las rutas para los usuarios 
router.post('/users', users.create);
router.patch("/users", auth.checkSession, users.update);
router.get("/users/:id/validate", users.validate);

router.post("/sessions", sessions.create);
router.delete("/sessions", auth.checkSession, sessions.destroy);

/* Middleware para rutas no encontradas (404)
Este middleware se ejecuta si ninguna de las rutas anteriores coincide con la solicitud. Aquí, llamamos a next() con un error de tipo 404 utilizando createError(404, 'Route not found')
*/
router.use((req, res, next) => {
  next(createError(404, 'Route not found'));  // Si no encuentra la ruta, crea un error 404
});

/* Middleware de manejo de errores
Este middleware se activa cuando llamas a next(error) en cualquier parte de tu aplicación.
- Si el error ya tiene un status definido, se utiliza tal cual. En el caso del middleware anterior, el error tendrá status: 404 porque lo definimos explícitamente.
- Si el error no tiene un status definido, se asume que es un error interno del servidor y se le asigna un código de estado 500.
*/
router.use((error, req, res, next) => { // error es un objeto que se pasa como parámetro en next(error)
  if (error instanceof mongoose.Error.CastError && error.message.includes('_id')) 
    error = createError(404, 'Resource not found');
  
  else if (error instanceof mongoose.Error.ValidationError) 
    error = createError(400, error); // Si es un error de validación de mongoose, se establece como 400
  
  else if (!error.status) error = createError(500, error.message); // Si es un error genérico o inesperado sin estado, se establece como 500.
  console.error(error);
  
  const data = {};
  data.message = error.message;
  if (error.errors) { // Si hay errores, se crea un objeto con los mensajes de error
    data.errors = Object.keys(error.errors) // Object.keys devuelve un array con las propiedades de un objeto
    .reduce((errors, errorKey) => { // reduce recorre un array y devuelve un único valor
      errors[errorKey] = error.errors[errorKey]?.message || error.errors[errorKey]; // ?.message || error.errors[errorKey] -> si hay un mensaje, se muestra el error, si no se crea un error que se le ha pasado como un string  
      return errors;  // Se devuelve el objeto con los mensajes de error
    }, {});
  }
  res.status(error.status).json(data);
});


module.exports = router;