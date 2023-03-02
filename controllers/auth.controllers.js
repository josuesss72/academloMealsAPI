const User = require("../models/user.models");
const {catchAsync} = require("../utils/catchAsync");
const {encriptPassword, generateJWT} = require("../utils/jwt");


// ----> SIGNUP <----
exports.signup = catchAsync(async (req, res, next) => {
  const {name, email, password, role} = req.body;

  const user = new User({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role: role.toLowerCase(),
  });

	// ENCRIPTAR PASSWORD
  user.password =  await encriptPassword(password)

  // GUARDAMOS DATOS
  await user.save()
	
  // GENERAMOS UN JWT
  const token = await generateJWT(user.id)

  res.status(200).json({
    status: 'success',
    message: 'Account created successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// ----> LOGIN <----
exports.login = catchAsync(async(req, res, next) => {
  const { user } = req;

  // GENERAMOS UN TOKEN 
  const token = await generateJWT(user.id)

  //ENVIAMOS RESPUESTA
  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  })
})

