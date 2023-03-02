const express = require('express');
const cors = require('cors');
const {db} = require('../database/db');
const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/error.controllers');
const {usersRoutes} = require('../routes/user.routes');
const {authRoutes } = require('../routes/auth.routes');
const {initModel} = require('./init.models');
const {restaurantsRoutes} = require('../routes/restaurants.routes');
const {mealsRoutes} = require('../routes/meals.routes');
const  {ordersRoutes } = require('../routes/orders.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    //Path Routes
    this.paths = {
      users: '/api/v1/users',
      auth: '/api/v1/auth',
      restaurants: '/api/v1/restaurants',
      meals: '/api/v1/meals',
      orders: '/api/v1/orders',
    }

    //Connect to db
    this.database();

    //Middlewares
    this.middlewares();

    //Routes
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.users, usersRoutes)
    this.app.use(this.paths.auth, authRoutes)
    this.app.use(this.paths.restaurants, restaurantsRoutes)
    this.app.use(this.paths.meals, mealsRoutes)
    this.app.use(this.paths.orders, ordersRoutes)

    this.app.all('*', (req, res, next) => {
      return next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404))
    })
    this.app.use(globalErrorHandler)
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authentication 😀'))
      .catch((err) => console.log('ERROR authentication 🧨 =>', err))

    initModel()

    db.sync()
      .then(() => console.log('Database SYNC 😃'))
      .catch((err) => console.log('ERROR sync 🧨 => ',err))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server Running On Port 🚀', this.port);
    });
  }
}

module.exports = Server;
