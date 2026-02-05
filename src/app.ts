import express from 'express';
import { PostRouter } from './modules/post/post.router';

const app = express();

app.use(express.json());

app.use('/posts',PostRouter)


export default app;