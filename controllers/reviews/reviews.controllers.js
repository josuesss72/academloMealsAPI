const {Reviews} = require("../../models/reviews.models");
const {catchAsync} = require("../../utils/catchAsync");

exports.newReviews = catchAsync(async(req, res, next) => {
  const { comment, rating } = req.body;
  const { seccionUser, restaurant } = req

  const review = await Reviews.create({
    comment: comment.toLowerCase(),
    rating: parseInt(rating),
    userId: seccionUser.id,
    restaurantId: restaurant.id 
  })

  res.status(200).json({
    status: 'success',
    message: 'Reviews added successfully',
    review: {
      comment: review.comment,
      rating: review.rating
    } 
  })
})

exports.updateReview = catchAsync(async(req, res, next) => {
  const { comment, rating } = req.body 
  const { review } = req

  await review.update({
    comment: comment.toLowerCase(),
    rating: parseInt(rating)
  })

  const findReview = await Reviews.findOne({
    where: {
      id: review.id
    },
    attributes: { exclude: ['createdAt', 'updatedAt', 'status'] }
  })
  
  res.status(200).json({
    status: 'success',
    message: 'Review updated successfully',
    review: findReview
  })
})

exports.deleteReview = catchAsync(async(req, res, next) => {
  const { review } = req

  await review.update({
    status: false
  })
  
  res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully'
  })
})
