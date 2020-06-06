import jwt from 'jsonwebtoken';

export const getUserId = (request, requestAuth = true) => {
  // Removing leading "Bearer "
  const token = request.request.headers.authorization.replace('Bearer ', '');

  if (token) {
    // Error thrown when secret-word(second arg) is not correct
    const decoded = jwt.verify(token, 'secret');

    return decoded.userId;
  }

  // No token & requestAuth true
  if (requestAuth) {
    throw new Error('Authorization token required for this action.');
  }

  // Only when requestAuth false
  return null;
};
