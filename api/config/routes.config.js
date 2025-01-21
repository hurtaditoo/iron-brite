const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const events = require('../controllers/events.controller');

router.get('/events', events.list);
router.get('/events/:id', events.detail);

router.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

router.use((error, req, res, next) => {
  if (!error.status) error = createError(500, error.message);
  console.error(error);
  
  const data = {};
  data.message = error.message;
  res.status(error.status).json(data);
});


module.exports = router;