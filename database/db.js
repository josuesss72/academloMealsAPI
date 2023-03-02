const {Sequelize} = require("sequelize");

const db = new Sequelize({
  // DIALECTO DE COMUNICACION
  dialect: process.env.DB_DIALECT,
  //direccion donde se encuentra la base de datos
  host: process.env.DB_HOST,
  //usuario por defecto postgre
  username: process.env.DB_USERNAME,
  //contraseña que se digita en postgre
  password: process.env.DB_PASSWORD,
  //nombre de la base de datos
  database: process.env.DB_DATABASE,
  // PUERTO DE LA BASE DE DATOS
  port: process.env.DB_PORT,
  logging: false,
});

module.exports = {db};
