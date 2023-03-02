const {Router} = require('express');
const {check} = require('express-validator');
const {signup, login} = require('../controllers/auth.controllers');
const {
  validUserByEmail,
  validUserPassword,
} = require('../middlewares/users/users.middlewares');
const {validateField} = require('../middlewares/users/validateField');

const router = Router();

router.post(
  '/signup',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email not contains the format expected').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    check('password', 'password is minimum 8 caracthers').isLength({min: 8}),
    check('role', 'role is normal or admin').custom(value => {
      if (value === 'normal') return true;
      if (value === 'admin') return true;
      return false;
    }),
    validateField,
  ],
  validUserByEmail,
  signup,
);

router.post(
  '/login',
  [
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email not contains the format correctly').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
    check('password', 'password minimum 8 caracthers').isLength({min: 8}),
    validateField,
  ],
  validUserByEmail,
  validUserPassword,
  login,
);

module.exports = {
  authRoutes: router,
};
