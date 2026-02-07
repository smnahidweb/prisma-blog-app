import express from 'express';
import { PostRouter } from './modules/post/post.router';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: process.env.APP_AUTH_URL || "http://localhost:4000",
    credentials: true,
}))

app.use(express.json());
app.use("/api/auth", toNodeHandler(auth));
app.use('/posts',PostRouter)


export default app;