const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // esto hace referencia a la colección de usuarios de la base de datos 
      ref: "User", // referencia al modelo User
    },

    lastAccess: {
      type: Date,
      default: Date.now,
    },
    
  },
  {
    timestamps: true, // añade la fecha de creación y modificación del documento
  }
);

// delete session after lastAccess + 1h
schema.index({ lastAccess: 1 }, { expireAfterSeconds: 3600 });  

const Session = mongoose.model("Session", schema);
module.exports = Session;
