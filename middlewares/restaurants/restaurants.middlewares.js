const {Restaurants} = require('../../models/restaurants.models');
const AppError = require('../../utils/appError');
const {catchAsync} = require('../../utils/catchAsync');

exports.validRestaurantByName = catchAsync(async (req, res, next) => {
  const {name} = req.body;

  const restaurant = await Restaurants.findOne({
    where: {
      name,
      status: true,
    },
  });

  if (restaurant) return new AppError('Restaurant exixts in database', 409);

  req.restaurant = restaurant;
  next();
});

exports.validRestaurantById = catchAsync(async(req, res, next) => {
  let id

  if(req.params.restaurantId){
    id = req.params.restaurantId  
  }else{
    id = req.params.id 
  }

  const restaurant = await Restaurants.findOne({
    where: {
      id,
    },
    attributes: {exclude: ['createdAt', 'updatedAt', 'status']}
  })

  if(!restaurant) return next(new AppError('Restaurant not found',404));

  req.restaurant = restaurant
  next() 
})
