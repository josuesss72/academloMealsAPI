const AppError = require("../utils/appError")

//____----> ERROR CONTROLLERS <----____

const handleError22P02 = () => new AppError('Some type of data send does not match was expected', 400)
const handleErrorJWT = () => new AppError('jsonwebtoken not received', 400)

// ----> RESPUESTAS DE ERRORES <----
const sendErrorDev = (err, res) => {
	console.log('ERROR 💣 => ', err)
	res.status(err.statusCode).json({
		name: err.name,
		status: err.status,
		message: err.message,
		stack: err.stack,
		err: err.statusCode
	})
}

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		})
	}else {
		console.error('ERROR 💣 =>',err)
		res.status(500).json({
			status: 'fail',
			message: 'Something went very wrong!'
		})
	}
}


// ----> GLOBAL ERROR HANDLER <----

const globalErrorHandler = (err, req, res, next) => {
	console.log(err)
	//ASIGNAMOS AL ERROR COMO INTERNO
	err.statusCode = err.statusCode || 500
	err.status = err.status || 'fail'

	// SI LA APLICAION SE ESTA EJECUTANO EN DESARROLLO 
	if(process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res)	
	}

	// SI LA APPLICATION SE ESTA EJECUTANO EN PRODUCCION
	if(process.env.NODE_ENV === 'production') {
		let error = { ...err }
		
		if(!error.parent?.code) {
			error = err
		}
 
		// CUSTOM ERRORS
		if(error.parent?.code === '22P02') error = handleError22P02()
		if(error.name === 'JsonWebTokenError') error = handleErrorJWT()

		sendErrorProd(error, res)
	}

}

module.exports = globalErrorHandler
