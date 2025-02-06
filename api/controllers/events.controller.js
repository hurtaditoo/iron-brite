const createError = require('http-errors');
const Event = require('../models/event.model');
const Comment = require("../models/comment.model");

module.exports.list = (req, res, next) => {
  Event.find()  // Devuelve una promesa con todos los eventos
  .populate("comments") // populate comments. thanks to Event virtual "comment" field  
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

module.exports.create = (req, res, next) => {
  const { body } = req;

  Event.create(body)
    .then((event) => res.status(201).json(event))
    .catch((error) => next(error));
}

module.exports.detail = (req, res, next) => {
  const { id } = req.params;

  Event.findById(id)
    .populate("comments")
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
  
  Event.findByIdAndUpdate(id, body, { runValidators: true, new: true })
    .then((event) => {
      if (!event) next(createError(404, 'Event not found'))
      else res.status(201).json(event);
    })
    .catch((error) => next(error));
}

module.exports.createComment = (req, res, next) => {
  Comment.create({
    text: req.body.text,
    user: req.user.id,
    event: req.params.id,
  })
    .then((comment) => res.status(201).json(comment))
    .catch(next);
};

module.exports.detailComment = (req, res, next) => {
  Comment.findById(req.params.commentId)
    .populate("user") // populate user. thanks to model reference to User
    .populate("event") // populate event. thanks to model reference to Event
    .then((comment) => res.json(comment))
    .catch(next);
};