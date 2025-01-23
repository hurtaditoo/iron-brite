const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    require: 'Event title is required'
  }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;