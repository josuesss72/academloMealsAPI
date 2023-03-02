const {Meals} = require('../../models/meals.models');
const {Restaurants} = require('../../models/restaurants.models');
const AppError = require('../../utils/appError');
const {catchAsync} = require('../../utils/catchAsync');

exports.validExisteMealsByName = catchAsync(async (req, res, next) => {
  const {name} = req.body;

  const meals = await Meals.findOne({
    where: {
      name,
      status: true,
    },
  });

  console.log(meals);

  if (meals) return next(new AppError('Meals exixts in database', 409));

  req.meals = meals;
  next();
});

exports.validMealsById = catchAsync(async(req, res, next) => {
  let id

  if(req.body.mealId){
    id = req.body.mealId;
  }else{
    id = req.params
  }
  
  const meals = await Meals.findOne({
    where: {
      id,
      status: true,
    },
    attributes: {exclude: ['createdAt', 'updatedAt', 'status']},
    include: [
      {
        model: Restaurants,
        attributes: {exclude: ['createdAt', 'updatedAt', 'status']}
      }
    ]
  })

  if(!meals) return next(new AppError('Meals not found', 404));

  req.meals = meals
  next()
})
