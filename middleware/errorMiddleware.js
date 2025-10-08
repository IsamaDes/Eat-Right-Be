const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({ message: "User not found" });
  next(error);
};

const invalidCredentials = (req, res, next) => {
  const error = new Error("Invalid Credentials");
  res.status(401);
  next(error);
};

const badRequest = (req, res, next) => {
  const error = new Error("Bad Request");
  res.status(400);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  notFound,
  invalidCredentials,
  badRequest,
  errorHandler,
};
