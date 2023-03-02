const {Router} = require('express');
const {check} = require('express-validator');
const {
  newOrder,
  findOrdersMe,
  completeOrders,
  deleteOrder,
} = require('../controllers/orders/orders.controlllers');
const {protect, protectAccountOwner} = require('../middlewares/auth/auth.middlewares');
const {validMealsById} = require('../middlewares/meals/meals.middlewares');
const {validOrderById} = require('../middlewares/orders/orders.middlewares');

const router = Router();

router.use(protect);
router.post(
  '/',
  [
    check('quantity', 'quantity is required').not().isEmpty(),
    check('quantity', 'quantity is numeric').isNumeric(),
    check('mealId', 'mealId is required').not().isEmpty(),
    check('mealId', 'mealId is numeric').isNumeric(),
  ],
  validMealsById,
  newOrder,
);
router.get('/me', findOrdersMe);
router.patch('/:id', validOrderById, protectAccountOwner, completeOrders);
router.delete('/:id', validOrderById, deleteOrder);

module.exports = {
  ordersRoutes: router,
};
