import jsonwebtoken from "jsonwebtoken";

import User from '../models/User.js';

let users = [];

export default class socketController {
    static async getUserData(io, socket, data) {
        const newUser = new User('users');
        jsonwebtoken.verify(data, "securepass", async (err, decoded) => {
            if (err) {
                // res.status(403).redirect("/login");
                return;
            }
            await newUser.find(decoded.id);
            const userData = {
                login: newUser.login,
                id: newUser.id,
                picture: newUser.picture_path,
                wins: newUser.wins,
                loses: newUser.loses
            };
            socket.emit("userData", userData);
            return userData;
        });
    }
}