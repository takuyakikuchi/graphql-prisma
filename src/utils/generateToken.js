import jwt from 'jsonwebtoken';

export const generateToken = (user, expirationDay) => {
  return jwt.sign({ userId: user.id }, 'secret', {
    expiresIn: `${expirationDay} days`,
  });
};
