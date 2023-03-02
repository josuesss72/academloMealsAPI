const {Meals} = require("../../models/meals.models");
const {Restaurants} = require("../../models/restaurants.models");
const {catchAsync} = require("../../utils/catchAsync");

exports.newMeals = catchAsync(async(req, res, next) => {
  const { name, price } = req.body;
  const { restaurant } = req

  const mealsCreated = await Meals.create({
    name: name.toLowerCase(),
    price: parseFloat(price),
    restaurantId: restaurant.id 
  })

  const meals = await Meals.findOne({
    where: {
      id: mealsCreated.id
    },
    attributes: {exclude: ['createdAt', 'updatedAt', 'status']}
  })

  res.status(200).json({
    status: 'success',
    message: 'Meals created successfully',
    meals
  })
})

exports.findAllMeals = catchAsync(async(req, res, next) => {
  const meals = await Meals.findAll({
    where: {
      status: true
    },
    attributes: {exclude: ['createdAt', 'updatedAt', 'status']},
    include: [
      {
        model: Restaurants,
        attributes: {exclude: ['createdAt', 'updatedAt', 'status']}
      }
    ]
  })

  res.status(200).json({
    status: 'success',
    message: 'Meals found successfully',
    meals
  })
})

exports.findMealById = catchAsync(async(req, res, next) => {
  const { meals } = req

  res.status(200).json({
    status: 'success',
    message: 'Meal found successfully',
    meals
  })
})

exports.updateMeals = catchAsync(async(req, res, next) => {
  const { name, price } = req.body
  const { meals } = req

  await meals.update({
    name: name.toLowerCase(),
    price: parseFloat(price)
  })

  res.status(200).json({
    status: 'success',
    message: 'Meal updated successfully'
  })
})

exports.deleteMeals = catchAsync(async(req, res, next) => {
  const { meals } = req

  await meals.update({
    status: false
  })

  res.status(200).json({
    status: 'success',
    message: 'Meal deleted successfully'
  })
}) 


