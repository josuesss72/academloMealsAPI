const {Restaurants} = require("../../models/restaurants.models");
const {catchAsync} = require("../../utils/catchAsync");

exports.newResteurant = catchAsync(async(req, res, next) => {
  const { name, address, rating } = req.body;

  const restaurantCreated = await Restaurants.create({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
    rating
  })

  res.status(201).json({
    status: 'success',
    message: 'restaurants created successfully',
    restaurantCreated
  })
})

exports.findAllRestaurants = catchAsync(async(req, res, next) => {
  const restaurants = await Restaurants.findAll({
    status: true,
    attributes: {exclude: ['createdAt', 'updatedAt', 'status']}
  })

  res.status(200).json({
    status: 'success',
    message: 'found restaurants successfully',
    restaurants
  })
})

exports.findRestaurant = catchAsync(async(req, res, next) => {
  const { restaurant } = req

  res.status(200).json({
    status: 'success',
    message: 'found restaurant successfully',
    restaurant
  })
})

exports.updateRestaurant = catchAsync(async(req, res, next) => {
  const { name, address } = req.body 
  const { restaurant } = req

  await restaurant.update({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
  }) 

  res.status(200).json({
    status: 'success',
    message: 'restaurant updated successfully',
  })
})

exports.deleteRestaurant = catchAsync(async(req, res, next) => {
  const { restaurant } = req

  await restaurant.update({
    status: false
  })

  res.status(200).json({
    status: 'success',
    message: 'restaurant deleted successfully'
  })
})

