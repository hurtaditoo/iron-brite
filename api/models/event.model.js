const mongoose = require('mongoose');
const dayjs = require('dayjs');

const eventSchema = new mongoose.Schema({ // Schema es un objeto que define la estructura de los eventos
  title: {
    type: String,
    require: [true, 'Event title is required'],  // Si no se pone un título, salta un error
    trim: true, // Quita los espacios en blanco al principio y al final
    minLength: [3, 'Event title needs at least 3 characters'],  // Si el título tiene menos de 3 caracteres, salta un error
    maxLength: [100, 'Event title needs at most 100 characters'], // Si el título tiene más de 100 caracteres, salta un error
  },

  description: {
    type: String,
    require: [true, 'Event description is required'],
    trim: true,
    minLength: [10, 'Event description needs at least 10 characters'],
    maxLength: [700, 'Event description needs at most 700 characters'],
  },

  startDate: {
    type: Date,
    require: [true, 'Event start date is required'],
    validate: {
      validator: function (startDate) {
        return dayjs(startDate).isAfter(dayjs()); // isBefore es una función de dayjs que devuelve true si startDate es anterior a la fecha actual
      },
      message: function() {
        return 'Starting date cannot be in the past'
      }
    }
  },
  
  endDate: {
    type: Date,
    require: [true, 'Ending date is required'],
    validate: {
      validator: function (endDate) {
        return dayjs(endDate).isAfter(dayjs(this.startDate)); // isAfter devuelve true si endDate es posterior a startDate
      },
      message: function() {
        return 'Ending date must be after starting date'
      }
    }
  }
}, {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        ret.id = doc.id;
        return ret;
      }
    }
});

const Event = mongoose.model('Event', eventSchema); // Model crea un objeto que se corresponde con modelo definido anteriormente
module.exports = Event; // Exporta el modelo para poder usarlo en otros archivos