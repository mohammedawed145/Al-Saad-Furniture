export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image files must be 5MB or smaller' : err.message;
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') {
    return res.status(404).json({ message: 'Not found' });
  }
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: status === 500 ? 'Server error' : err.message,
  });
}
