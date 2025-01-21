const createError = require('http-errors');
const { events } = require('../data/db.json');

module.exports.list = (req, res, next) => {
  res.json(events);
}

module.exports.detail = (req, res, next) => {
  const { id } = req.params;
  const event = events.find((event) => event.id === id);
  if (!event) {
    next(createError(404, 'Event not found'));
  } else {
    res.json(event);
  }
}