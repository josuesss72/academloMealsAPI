const User = require('../../models/user.models');
const AppError = require('../../utils/appError');
const {catchAsync} = require('../../utils/catchAsync');
const bcryptjs = require('bcryptjs');

exports.validUserById = catchAsync(async (req, res, next) => {
  const {id} = req.params;

  const user = await User.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!user) next(new AppError('User not found', 404));

  req.user = user;
  next();
});

// ----> USER EMAIL <----
exports.validUserByEmail = catchAsync(async (req, res, next) => {
  const {email} = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (req.body.name) {
    if (user) next(new AppError('User was exixts in database', 404));
  }

  if (user && !user.status) await user.update({status: true});

  if (!req.body.name) {
    if (!user) return next(new AppError('User not found', 404));
  }

  req.user = user;
  next();
});

// ----> USER PASSWORD <----
exports.validUserPassword = catchAsync(async (req, res, next) => {
  const {password} = req.body;
  const {user} = req;

  // COMPARAMOS PASSWORDS
  if (!(await bcryptjs.compare(password, user.password))) {
    return next(new AppError('Incorret password or emaiil', 401));
  }

  req.user = user;
  next();
});
