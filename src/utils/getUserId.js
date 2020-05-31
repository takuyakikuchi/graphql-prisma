import jwt from 'jsonwebtoken';

export const getUserId = (request) => {
  // Removing leading "Bearer "
  const token = request.request.headers.authorization.replace('Bearer ', '');

  if (!token) {
    throw new Error('Authorization token required for this action.');
  }

  // Error thrown when secret-word(second arg) is not correct
  const decoded = jwt.verify(token, 'secret');

  return decoded.userId;
};
