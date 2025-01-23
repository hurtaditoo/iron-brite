const createError = require('http-errors');
const Event = require('../models/event.model');

module.exports.list = (req, res, next) => {
  Event.find()
    .then((events) => res.json(events))
    .catch((error) => next(error));
}


module.exports.detail = (req, res, next) => {
  next(createError(404, 'Event not found'));
}