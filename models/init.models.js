const User = require("./user.models")
const {Meals} = require("./meals.models")
const {Orders} = require("./orders.models")
const {Reviews} = require("./reviews.models")
const {Restaurants} = require("./restaurants.models")

exports.initModel = () => {
  // USER <----> ORDERS 
  User.hasMany(Orders)
  Orders.belongsTo(User)

  // USER <----> REVIEWS
  User.hasMany(Reviews)
  Reviews.belongsTo(User)

  // ORDERS <----> MEALS
  Meals.hasOne(Orders)
  Orders.belongsTo(Meals)

  // RESTAURANT <----> MEALS
  Restaurants.hasMany(Meals)
  Meals.belongsTo(Restaurants)

  // RESTAURANT <----> REVIEWS
  Restaurants.hasMany(Reviews)
  Reviews.belongsTo(Restaurants)
}
