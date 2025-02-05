const createError = require('http-errors');
const Event = require('../models/event.model');

module.exports.list = (req, res, next) => {
  Event.find()  // Devuelve una promesa con todos los eventos
    .then((events) => res.json(events)) // Si se resuelve la promesa, se envía un json con los eventos
    .catch((error) => next(error));
}

module.exports.create = (req, res, next) => {
  const { body } = req;
  console.log(body);
  
  Event.create({
    title: body.title,
    description: body.description,
    startDate: body.startDate,
    endDate: body.endDate,
  }) // Crea un evento con los datos que se pasan en el body de la petición
    .then((event) => res.status(201).json(event)) // Si se resuelve la promesa, se envía un json con el evento creado
    .catch((error) => next(error));
}


module.exports.detail = (req, res, next) => { // detail se usa para obtener un evento en concreto
  const { id } = req.params;

  Event.findById(id)
    .then((event) => {
      if (!event) next(createError(404, 'Event not found'))
      else res.json(event);
    })
    .catch((error) => next(error));
}

module.exports.delete = (req, res, next) => {
  const { id } = req.params;

  Event.findByIdAndDelete(id)
    .then((event) => {
      if (!event) next(createError(404, 'Event not found'))
      else res.status(204).send();
    })
    .catch((error) => next(error))
}

module.exports.update = (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const permittedParams = ["title", "description", "startDate", "endDate"];
  
  Object.keys(body).forEach((key) => {
    if (!permittedParams.includes(key)) delete body[key];
  });
  
  Event.findByIdAndUpdate(id, body, { runValidators: true, new: true })
    .then((event) => {
      if (!event) next(createError(404, 'Event not found'))
      else res.status(201).json(event);
    })
    .catch((error) => next(error));
}