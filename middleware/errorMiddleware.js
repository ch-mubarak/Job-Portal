const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  const errMessage = res.statusCode ? err.message : "Something went wrong";
  res.status(statusCode).json({ message: errMessage });
};

module.exports = errorHandler;
