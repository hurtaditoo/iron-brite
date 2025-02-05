const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI) // Cuando hay una operación de e/s de datos, se hace una promesa 
  .then(() => console.info(`Successfully connected to the database ${MONGODB_URI}`))
  .catch((error) => {
    console.error(`An error occurred trying to connect to the database ${MONGODB_URI}`, error);
    process.exit(0);  // Si no se puede conectar a la base de datos, se cierra la app
  });

process.on('SIGINT', () => {  // SIGINT es una señal que se envía al proceso cuando se pulsa 'Ctrl+C' = cierra la app
  mongoose.connection.close()
    .finally(() => {
      console.log(`Database connection closed`);
      process.exit(0);
    })
});