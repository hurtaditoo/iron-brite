const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const createError = require('http-errors');

const router = express.Router();  // Crea los enrutamientos para abrir lo que le digamos después del / en la url

const events = require('../controllers/events.controller');
const users = require('../controllers/users.controller');
const sessions = require("../controllers/sessions.controller");
const auth = require("../middlewares/session.middleware");

router.get('/events', events.list);
router.post('/events', events.create);
router.get('/events/:id', events.detail);
router.delete('/events/:id', events.delete);
router.patch('/events/:id', events.update);

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

router.use((error, req, res, next) => {
  console.error(error);
  if (error instanceof mongoose.Error.CastError && error.message.includes('_id')) error = createError(404, 'Resource not found');
  else if (error instanceof mongoose.Error.ValidationError) error = createError(400, error);
  else if (!error.status) error = createError(500, error.message);
  console.error(error);
  
  const data = {};
  data.message = error.message;
  if (error.errors) {
    data.errors = Object.keys(error.errors)
      .reduce((errors, errorKey) => {
        errors[errorKey] = error.errors[errorKey].message;
        return errors;
      }, {});
  }
  res.status(error.status).json(data);
});


module.exports = router;