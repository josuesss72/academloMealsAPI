const {Router} = require('express');
const {check} = require('express-validator');
const {
  newResteurant,
  findAllRestaurants,
  findRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurants/restaurants.controllers');
const {
  newReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviews/reviews.controllers');
const {protect, restricTo, protectAccountOwner} = require('../middlewares/auth/auth.middlewares');
const {
  validRestaurantByName,
  validRestaurantById,
} = require('../middlewares/restaurants/restaurants.middlewares');
const {
  validReviewById,
  protectReview,
} = require('../middlewares/reviews/reviews.middlewares');
const {validateField} = require('../middlewares/users/validateField');

// ____----> RESTAURANT ROUTES <----____

const router = Router();

router.get('/', findAllRestaurants);
router.get('/:id', validRestaurantById, findRestaurant);

//----> RUTAS PROTEGIDAS <----
router.use(protect);

router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
    check('address', 'address is required').not().isEmpty(),
    check('rating', 'rating is required').not().isEmpty(),
    check('rating', 'rating is from 1 a 5').custom(x =>
      x >= 1 && x <= 5 ? true : false,
    ),
    validateField,
  ],
  restricTo('admin'),
  validRestaurantByName,
  newResteurant,
);

router.patch(
  '/:id',
  [
    check('name', 'name is required').not().isEmpty(),
    check('address', 'address is required').not().isEmpty(),
    validateField,
  ],
  restricTo('admin'),
  validRestaurantById,
  updateRestaurant,
);

router.delete('/:id', restricTo('admin'), validRestaurantById, deleteRestaurant);

// ----> REVIEWS ROUTES <----
router.post(
  '/reviews/:id',
  [
    check('comment', 'comment is required').not().isEmpty(),
    check('rating', 'rating is required').not().isEmpty(),
    check('rating', 'rating is from 1 a 5').custom(x =>
      x >= 1 && x <= 5 ? true : false,
    ),
    validateField,
  ],
  validRestaurantById,
  newReviews,
);

router.patch(
  '/reviews/:restaurantId/:id',
  [
    check('comment', 'comment is required').not().isEmpty(),
    check('rating', 'rating is required').not().isEmpty(),
    check('rating', 'rating is from 1 a 5').custom(x =>
      x >= 1 && x <= 5 ? true : false,
    ),
    validateField
  ],
  validRestaurantById,
  validReviewById,
  protectAccountOwner,
  updateReview,
);

router.delete(
  '/reviews/:restaurantId/:id',
  validRestaurantById,
  validReviewById,
  protectAccountOwner,
  deleteReview,
);

module.exports = {
  restaurantsRoutes: router,
};
