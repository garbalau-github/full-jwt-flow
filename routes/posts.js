import router from 'express';
import { privatePosts, publicPosts } from '../db.js';
import { checkAuth } from '../middleware/checkAuth.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const postsRouter = router.Router();

// GET /posts/public
postsRouter.get('/public', (req, res) => {
  res.json(publicPosts);
});

// GET /posts/private
postsRouter.get('/private', checkAuth, (req, res) => {
  res.json(privatePosts);
});

export default postsRouter;
