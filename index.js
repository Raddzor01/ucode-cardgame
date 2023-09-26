import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import authRouter from "./routes/authRouter.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve('public')));
app.use(express.static(path.resolve('resources')));

app.use(authRouter);

app.use((req, res, next)=>{
    res.status(404).send("Not Found");
});

app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});