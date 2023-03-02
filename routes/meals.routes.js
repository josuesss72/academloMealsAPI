const {Router} = require('express');
const {check} = require('express-validator');
const {
  newMeals,
  findAllMeals,
  findMealById,
  updateMeals,
  deleteMeals,
} = require('../controllers/meals/meals.controllers');
const {protect, restricTo} = require('../middlewares/auth/auth.middlewares');
const {
  validExisteMealsByName,
  validMealsById,
} = require('../middlewares/meals/meals.middlewares');
const {
  validRestaurantById,
} = require('../middlewares/restaurants/restaurants.middlewares');
const {validateField} = require('../middlewares/users/validateField');

// ____----> MEALS ROUTER <----____

const router = Router();

router.get('/', findAllMeals);
router.get('/:id', validMealsById, findMealById);

// ----> ROUTES PROTEGIDAS <----
router.use(protect);
router.post(
  '/:id',
  [
    check('name', 'name is required').not().isEmpty(),
    check('price', 'price is required').not().isEmpty(),
    check('price', 'price is numeric').isNumeric(),
    validateField,
  ],
  restricTo('admin'),
  validRestaurantById,
  validExisteMealsByName,
  newMeals,
);
router.patch(
  '/:id',
  [
    check('name', 'name is required').not().isEmpty(),
    check('price', 'price is required').not().isEmpty(),
    check('price', 'price is numeric').isNumeric(),
    validateField,
  ],
  restricTo('admin'),
  validMealsById,
  updateMeals,
);
router.delete('/:id', restricTo('admin'), validMealsById, deleteMeals);

module.exports = {
  mealsRoutes: router,
};
