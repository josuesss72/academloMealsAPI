const {validationResult} = require('express-validator');

// ____----> VALIDATE FIELD <----____

exports.validateField = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};
