const {Meals} = require("../../models/meals.models");
const {Orders} = require("../../models/orders.models");
const {Restaurants} = require("../../models/restaurants.models");
const User = require("../../models/user.models");
const {catchAsync} = require("../../utils/catchAsync");

exports.findAllOrders = catchAsync(async(req, res, next) => {
  const { seccionUser } = req

  const orders = await Orders.findAll({
    userId: seccionUser.id,
    status: 'active',
    include: [
      {
        model: Meals,
        include: [
          {
            model: Restaurants
          }
        ]
      },
      {
        model: User,
        attributes: ['id', 'name', 'email', 'role']
      }
    ]
  })

  res.status(200).json({
    status: 'success',
    message: 'found Orders successfully',
    orders
  })
});

exports.findOrdersById = catchAsync(async(req, res, next)=> {
  const { order } = req 
  
  res.status(200).json({
    status: 'success',
    message: 'Order found successfully',
    order
  })
})

exports.newOrder = catchAsync(async(req, res, next)=> {
  const { quantity, mealId } = req.body
  const { seccionUser, meals } = req

  await Orders.create({
    quantity,
    mealId,
    userId: seccionUser.id,
    totalPrice: meals.price * quantity 
  })

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
  })
}) 

exports.findOrdersMe = catchAsync(async(req, res, next) => {
  const { seccionUser } = req

  const orders = await Orders.findAll({
    where: {
      userId: seccionUser.id 
    },
    attributes: {exclude: ['createdAt', 'updatedAt', 'status']},
    include: [
      {
        model: Meals,
        attributes: {exclude: ['createdAt', 'updatedAt', 'status']},
        include: [
          {
            model: Restaurants,
            attributes: {exclude: ['createdAt', 'updatedAt', 'status']}
          }
        ]
      }
    ]
  })

  res.status(200).json({
    status: 'success',
    message: 'Orders found successfully',
    orders
  })
})

exports.completeOrders = catchAsync(async(req, res, next) => {
  const { order } = req 

  await order.update({status: 'completed'})

  const orders = await Orders.findOne({
    where: {
      id: order.id,
    },
    attributes: {exclude: ['createdAt', 'updatedAt']}
  })

  res.status(200).json({
    status: 'success',
    message: 'Orders completed successfully',
    orders
  })
}) 

exports.deleteOrder = catchAsync(async(req, res, next) => {
  const { order } = req

  await order.update({status: 'cancelled'})

  res.status(200).json({
    status: 'success',
    message: 'Orders deleted successfully'
  })
})
