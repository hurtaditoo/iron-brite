const mongoose = require('mongoose');
const dayjs = require('../config/dayjs.config');
const { events } = require("./user.model");

const eventSchema = new mongoose.Schema({ // Schema es un objeto que define la estructura de los eventos
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minLength: [3, 'Title needs at least 3 characters'],
    maxLength: [100, 'Title characters must be lower than 100'],
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minLength: [10, 'Description needs at least 3 characters'],
    maxLength: [700, 'Description characters must be lower than 100'],
  },

  startDate: {
    type: Date,
    required: [true, 'Starting date is required'],
    validate: {
      validator: function (startDate) {
        return dayjs(startDate).isAfter(dayjs());
      },
      message: function () {
        return 'Starting date can not be in the past'
      }
    }
  },

  endDate: {
    type: Date,
    required: [true, 'Ending date is required'],
    validate: {
      validator: function (endDate) {
        return dayjs(endDate).isAfter(dayjs(this.startDate));
      },
      message: function () {
        return 'Starting date can not be in the past'
      }
    }
  }

}, {
  timestamps: true,
  toJSON: {
    virtuals: true, // include virtuals when object is converted to JSON
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret._id;
      ret.id = doc.id;
      return ret;
    },
  },
});

// Virtual property to get comments from a event. Loading Comment.find({ event: event._id }) automatically
eventSchema.virtual("comments", { 
  // virtual no se guarda en la base de datos, pero se puede acceder a él como si fuera un campo real. Esto se usa para obtener los N de la relación 1xN
  ref: "Comment",
  localField: "_id",  // Campo local que se va a comparar con el campo foráneo
  foreignField: "event",  // Campo foráneo que se va a comparar con el campo local
  justOne: false, // Si es true, se obtiene un solo documento, si es false, se obtiene un array de documentos
});

const Event = mongoose.model('Event', eventSchema); // Model crea un objeto que se corresponde con modelo definido anteriormente
module.exports = Event; // Exporta el modelo para poder usarlo en otros archivos