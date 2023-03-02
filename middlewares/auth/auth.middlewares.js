const {catchAsync} = require('../../utils/catchAsync');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../../models/user.models');
const AppError = require('../../utils/appError');

// ____----> AUTH MIDDLEWARES <----____

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;
  const ketSecret = process.env.SECRET_JWT_SEED;

  // VERIFICAMOS EL TOKEN SEA DE TIPO BEARER Y QUE LO ENVIE
  if (token && token.startsWith('Bearer')) {
    token = token.split(' ')[1];
  }

  // VERIFICAMOS QUE EL TOKEN SEA EL CORRECTO
  const tokenDecoded = await promisify(jwt.verify)(token, ketSecret);

  // VERIFICAMOS SI EXISTE EL USUARIO CON EL TOKEN
  const user = await User.findOne({
    where: {
      id: tokenDecoded.id,
      status: true,
    },
  });

  if (!user)
    return next(new AppError('User not found with token correctly', 404));
  if (!token)
    return next(new AppError('Not authorized, your are not logged in', 401));

  //VERIFICAMOS SI EL USUARIO CAMBIO SU PASSWORD DESPUES QUE HAYA GENERADO EL TOKEN
  if (user.passwordChangedAt) {
    const timeNewPassword = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10,
    );

    if (tokenDecoded.iat < timeNewPassword)
      return next(new AppError('The user recently changed password', 401));
  }

  req.seccionUser = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const {user, seccionUser} = req;

  if (user.id !== seccionUser.id) {
    return next(new AppError('The user not is of user on seccion'));
  }

  req.user = user;
  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    const { seccionUser } = req
    
    if(!roles.includes(seccionUser.role)) {
      return next(new AppError('You do not have permission to perform the operation', 403))
    }

    next()
  }
}
