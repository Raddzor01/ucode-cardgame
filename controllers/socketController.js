import jsonwebtoken from "jsonwebtoken";

import User from '../models/User.js';
import MatchQueue from "./matchQueue.js";

let roomNbr = 0;
let gameRooms = [];
const matchQueue = new MatchQueue();

export default class socketController {
    static async getUserData(io, socket, data) {
        return new Promise(async (resolve, reject) => {
            const newUser = new User('users');
            let userData = {};

            try {
                const decoded = await jsonwebtoken.verify(data, "securepass");

                await newUser.find(decoded.id);
                userData = {
                    login: newUser.login,
                    id: newUser.id,
                    picture: newUser.picture_path,
                    wins: newUser.wins,
                    loses: newUser.loses
                };

                socket.emit("userData", userData);
                userData.socket = socket;
                userData.roomNbr = 0;
                userData.hp = 30;

                resolve(userData);
            } catch (err) {
                reject(err);
            }
        });
    }

    static async findGame(io, socket, data, userData) {
        socket.join("room-" + roomNbr);
        userData.roomNbr = roomNbr;
        if(matchQueue.getLength() > 0) {
            userData.roomNbr = roomNbr;
            matchQueue.dequeue();
            gameRooms[roomNbr].players.push(userData);
            io.sockets.in("room-" + roomNbr).emit("toGame", "game");
            const players = gameRooms[roomNbr].players;

            const firstPlayer = {
                login: players[0].login,
                wins: players[0].wins,
                profile_image: players[0].picture_path
            };

            const secondPlayer = {
                login: players[1].login,
                wins: players[1].wins,
                profile_image: players[1].picture_path
            };


            io.sockets.in("room-" + roomNbr).emit("startGame", [firstPlayer, secondPlayer]);
            roomNbr++;
            return;
        }

        gameRooms[roomNbr] = {players: []};
        userData.roomNbr = roomNbr;
        gameRooms[roomNbr].players.push(userData);
        matchQueue.enqueue(userData);
        return userData;
    }

    static async connectToRoom(io, socket, data, userData) {
        const decoded = await jsonwebtoken.verify(data, "securepass");
        const foundRoom = findRoomByUserData(decoded.id, decoded.login);
        if(foundRoom) {
            userData.roomNbr = foundRoom.roomNbr;
            socket.join("room-" + roomNbr);
            const players = foundRoom.players;

            const firstPlayer = {
                login: players[0].login,
                wins: players[0].wins,
                profile_image: players[0].picture
            };

            const secondPlayer = {
                login: players[1].login,
                wins: players[1].wins,
                profile_image: players[1].picture
            };

            console.log(firstPlayer);

            io.sockets.in("room-" + roomNbr).emit("startGame", [firstPlayer, secondPlayer]);
            return userData;
        }
    }

    static async cancelSearch(io, socket, data) {
        const decoded = await jsonwebtoken.verify(data, "securepass");
        matchQueue.removePlayerById(decoded.id);
    }
}

function findRoomByUserData(id, login) {
    for (const room of gameRooms) {
        for (const player of room.players) {
            if (player.id === id && player.login === login) {
                return room;
            }
        }
    }
    return null; // Комната не найдена
}
