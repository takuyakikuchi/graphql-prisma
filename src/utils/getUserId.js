import jwt from 'jsonwebtoken';

export const getUserId = (request, requestAuth = true) => {
  // Removing leading "Bearer "
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  if (header) {
    const token = header.replace('Bearer ', '');

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
