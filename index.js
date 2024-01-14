import express from 'express';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRouter);
app.use('/posts', postsRouter);

// GET /
app.get('/', (req, res) => {
  res.send('full-auth-flow');
});

app.listen(3000, () => console.log('Server is listening at :3000!'));
