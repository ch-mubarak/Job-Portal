const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  const errMessage = err.statusCode ? err.message : "Something went wrong";
  res.status(statusCode).json({ message: errMessage });
};

module.exports = errorHandler;
