const {Orders} = require('../../models/orders.models');
const User = require('../../models/user.models');
const AppError = require('../../utils/appError');
const {catchAsync} = require('../../utils/catchAsync');

exports.validOrderById = catchAsync(async (req, res, next) => {
  const {id} = req.params;
  //const {seccionUser} = req;

  const order = await Orders.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: User,
        attributes: {exclude: ['createdAt', 'updatedAt', 'status']}
      }
    ]
  });

  if (!order) return next(new AppError('Order not found', 404));

  req.user = order.user
  req.order = order;
  next();
});

