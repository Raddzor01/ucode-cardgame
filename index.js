import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';

import authRouter from "./routes/authRouter.js";
import socketRouter from "./routes/socketRouter.js";

const port = process.env.PORT || 8000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve('public')));
app.use(express.static(path.resolve('resources')));

app.use(authRouter);

app.use((req, res, next)=>{
    res.status(404).send("Not Found");
});

const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socketRouter(io, socket);
});

server.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});