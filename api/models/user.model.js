const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^.{8,}$/; // '^' es para que si o si empiece por lo que sigue, '.' es para que sea cualquier carácter menos salto de linea, '{8,}' para que tenga al menos 8 caracteres

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'User name is required'],
    maxLength: [30, 'User name characters must be lower than 30'],
    trim: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'User email is required'],
    match: [EMAIL_PATTERN, 'Invalid user email pattern']    // EMAIL_PATTERN es una expresión regular que valida el email, si el email no cumple con la expresión regular, se mostrará el mensaje 
  },

  password: {
    type: String,
    required: [true, 'User password is required'],
    match: [PASSWORD_PATTERN, 'Invalid user password pattern']
  },

  active: {
    type: Boolean,
    default: false,
  },

  activateToken: {
    type: String,
    default: function () {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      );
    },
  },

  avatar: {
    type: String,   // usamos function anónima para poder acceder a 'this' 
    default: function () {  // puede ser string o function, si es una función, se ejecutará cada vez que se cree un nuevo usuario
      return `https://i.pravatar.cc/350?u=${this.email}`    // buscamos el query del email para que cada email tenga un avatar diferente
    },
    validate: { // es una validación personalizada, se puede hacer con una función o con un objeto
      validator: function (avatar) {
        try {
          new URL(avatar);  // si la URL es válida, no se lanzará ningún error
          return true;
        } catch (e) {
          return false;
        }
      },
      message: function () {
        return 'Invalid avatar URL'
      }
    }
  }

}, {    // para saber la fecha de creación y modificación de un usuario

  timestamps: true,
  toJSON: { // toJSON se ejecuta cada vez que se convierte un documento de mongoose en JSON
    transform: function (doc, ret) {    // doc es el documento de mongoose, ret es el objeto JSON
      delete ret.__v;   // elimina la versión del documento
      delete ret._id;   // elimina el id del documento
      delete ret.password;  // elimina la contraseña del documento
      delete ret.activateToken;
      ret.id = doc.id;  // añade el id del documento al objeto ret
      return ret;
    }
  }
});

userSchema.pre('save', function (next) {    // pre('save') -> se ejecuta antes de guardar el documento en la base de datos, con una función anónima que recibe un next
  if (this.isModified('password')) {    // Si la contraseña del usuario que estamos tocando ha sido modificada
    bcrypt
      .hash(this.password, SALT_WORK_FACTOR)    // bcrypt.hash() -> encripta la contraseña, SALT_WORK_FACTOR es el número de veces que se va a encriptar la contraseña
      .then((hash) => { // hash es la contraseña encriptada, me devuelve ese hash
        this.password = hash;
        next();
      })
      .catch((error) => next(error))
  } else {  // Si la contraseña no ha sido modificada (por ejemplo, si se modifica el nombre o el email) se pasa al siguiente middleware
    next();
  }
})

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);  // si se modifica la contraseña, se encripta y se compara con la contraseña encriptada que ya está en la base de datos
};

const User = mongoose.model('User', userSchema);    // model('User') -> User is the name of the model, este name lo hemos escogido en este momento, podría haber sido otro
module.exports = User;