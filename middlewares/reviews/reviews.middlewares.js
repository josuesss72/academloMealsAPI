const {Reviews} = require('../../models/reviews.models');
const User = require('../../models/user.models');
const AppError = require('../../utils/appError');
const {catchAsync} = require('../../utils/catchAsync');

exports.validReviewById = catchAsync(async (req, res, next) => {
  const {id} = req.params;

  const review = await Reviews.findOne({
    where: {
      id,
      status: true,
    },
    include: {
      model: User,
      attributes: {exclude: [
        'createdAt',
        'updatedAt',
        'status',
      ]}
    }
  });

  if (!review) return next(new AppError('Review not found', 404));

  req.review = review;
  req.user = review.user;
  next();
});

