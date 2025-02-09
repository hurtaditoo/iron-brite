const Session = require("../models/session.model");
const createError = require("http-errors");

module.exports.checkSession = (req, res, next) => {
  // const sessionId = req.headers.cookie?.split("session=")[1]; // si no hay cookie, se pone undefined
  // headers es un objeto que tiene todas las cabeceras de la petición, y cookie es una de ellas
  // split("session=")[1] -> divide la cadena en dos partes, y se queda con la segunda parte, que es la que está después de session=

  // find session id from cookie. imagine cookie is "session=1234; other=5678"
  const sessionId = req.headers.cookie
    ?.split(";")
    ?.find((cookie) => cookie.includes("session="))
    ?.split("=")?.[1];

  if (!sessionId) {
    return next(createError(401, "missing session from cookie header"));
  }

  Session.findById(sessionId)
    .populate("user") // al hacer esto se obtiene el usuario asociado a esa sesión, por lo que no hace falta hacer otra consulta para obtener todos los details
    .then((session) => {
      if (session) {
        if (session.user) {
          // update last access time to keep session alive
          session.lastAccess = new Date();
          session.save();

          // leave user on req object so next middlewares can access to it
          req.session = session;
          req.user = session.user;

          // continue to next middleware or controller
          next();
        } else {
          next(createError(401, "unauthorized. wrong user"));
        }
      } else {
        next(createError(401, "unauthorized. session not found"));
      }
    })
    .catch(next);
};