const User = require('../../models/user.models');
const {catchAsync} = require('../../utils/catchAsync');

// ____----> USERS CONTROLLERS <----____

exports.updatedUserPerfil = catchAsync(async (req, res, next) => {
  const {name, email} = req.body;
  const {user} = req;

  await user.update({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
  });

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: false })

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully'
  })
})
