import router from 'express';
import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';
import { users } from '../db.js';
import jwt from 'jsonwebtoken';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const authRouter = router.Router();

// GET /auth/all
authRouter.get('/all', (req, res) => {
  res.json(users);
});

// POST /auth/sign-up
authRouter.post(
  // Path
  '/sign-up',
  // Validation
  [
    check('email', 'Please provide a valid email').isEmail(),
    check(
      'password',
      'Please provide a password that is greater than 5 characters'
    ).isLength({ min: 6 }),
  ],
  // Handler
  async (req, res) => {
    const { email, password } = req.body;

    // Check for validation errors, if any, return them to the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If there are no validation errors, proceed with the rest of the code
    // Check if the user already exists (local database)
    const userExists = users.find((user) => user.email === email);

    // If the user already exists, return an error to the client
    if (userExists) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This user already exists',
          },
        ],
      });
    }

    // If the user does not exist, create a new user and add it to the database

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    users.push({
      email,
      password: hashedPassword,
    });

    // Create token for the user and send it to the client (JWT)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send the token to the client
    res.json({
      token,
    });
  }
);

// POST /auth/log-in
authRouter.post(
  // Path
  '/log-in',
  // Validation
  [
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Please provide a password').exists(),
  ],
  // Handler
  async (req, res) => {
    const { email, password } = req.body;

    // Check for validation errors, if any, return them to the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If there are no validation errors, proceed with the rest of the code
    // Check if the user already exists (local database)
    const userExists = users.find((user) => user.email === email);

    // If the user does not exist, return an error to the client
    if (!userExists) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid credentials',
          },
        ],
      });
    }

    // Compare the password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );

    // If the password is not correct, return an error to the client
    if (!isPasswordCorrect) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid credentials',
          },
        ],
      });
    }

    // If the password is correct, create a token for the user and send it to the client
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send the token to the client
    res.json({
      token,
    });
  }
);

export default authRouter;
