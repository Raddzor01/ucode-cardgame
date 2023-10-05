import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import fileUpload from 'express-fileupload';
import config from "./config.json" assert { type: 'json' };
import authRouter from "./routes/expressRouter.js";
import socketRouter from "./routes/socketRouter.js";


const port = config.port || 8000;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({}));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve('public')));
app.use(express.static(path.resolve('resources')));

app.use(authRouter);

app.use((req, res, next)=>{
    res.status(404).send("Not Found");
});

io.on('connection', (socket) => {
    socketRouter(io, socket);
});

server.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});