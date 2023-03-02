const {Router} = require('express');
const {findAllOrders, findOrdersById} = require('../controllers/orders/orders.controlllers');
const {updatedUserPerfil, deleteUser} = require('../controllers/users/users.controllers');
const {protect, protectAccountOwner} = require('../middlewares/auth/auth.middlewares');
const {validOrderById} = require('../middlewares/orders/orders.middlewares');
const {validUserById } = require('../middlewares/users/users.middlewares');


// ____----> USER ROUTES <----____

const router = Router();

router.use(protect)

router.patch('/:id', validUserById,  protectAccountOwner, updatedUserPerfil)
router.delete('/:id', validUserById, protectAccountOwner, deleteUser)
router.get('/orders', findAllOrders)
router.get('/orders/:id', validOrderById, findOrdersById)

module.exports = {
  usersRoutes: router,
};
