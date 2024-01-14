import jwt from 'jsonwebtoken';
// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

export const checkAuth = (req, res, next) => {
  let token = req.get('x-auth-token');

  if (!token) {
    return res.status(401).json({
      errors: [
        {
          msg: 'No token found',
        },
      ],
    });
  }

  try {
    let user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user.email;
    next();
  } catch (error) {
    return res.status(401).json({
      errors: [
        {
          msg: 'Token is invalid',
        },
      ],
    });
  }
};
