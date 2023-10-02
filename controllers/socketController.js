import jsonwebtoken from "jsonwebtoken";

import config from "../config.json" assert { type: 'json' };
import User from '../models/User.js';
import Card from "../models/Card.js";
import MatchQueue from "../utils/matchQueue.js";

let roomNbr = 0;
let gameRooms = [];

let gameStarted = false;
const cardsDeck = new Card();
cardsDeck.getAllCards();

let roomCreated = false;

const matchQueue = new MatchQueue();

export default class socketController {
    static async getUserData(io, socket, data) {
        return new Promise(async (resolve, reject) => {
            const newUser = new User();
            let userData = {};

            try {
                const decoded = await jsonwebtoken.verify(data, config.jswt.secretKey);

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
        socket.join(`tempRoom-${roomNbr}`);
        userData.roomNbr = roomNbr;
        if(matchQueue.getLength() > 0) {
            matchQueue.dequeue();
            gameRooms[roomNbr].players.push(userData);
            io.sockets.in(`tempRoom-${roomNbr}`).emit("toGame", "game");
            roomNbr++;
        } else {
            gameRooms[roomNbr] = {players: []};
            userData.roomNbr = roomNbr;
            gameRooms[roomNbr].players.push(userData);
            matchQueue.enqueue(userData);
        }
        return userData;
    }

    static async connectToRoom(io, socket, data, userData) {
        const { id, login } = jsonwebtoken.verify(data, config.jswt.secretKey);
        const foundRoom = findRoomByUserData(id, login);
        if(!foundRoom)
            return;

        userData.roomNbr = foundRoom.roomNbr;

        socket.join(`room-${roomNbr}`);

        if(roomCreated === false) {
            roomCreated = true;
            return;
        }

        const players = foundRoom.players;

        const firstTurn = Math.floor(Math.random() * 2);

        const firstPlayer = {
            login: players[0].login,
            wins: players[0].wins,
            profile_image: players[0].picture,
            firstTurn: firstTurn === 0,
            startCards: id === players[0].id ? generateStartCards() : null
        };

        const secondPlayer = {
            login: players[1].login,
            wins: players[1].wins,
            profile_image: players[1].picture,
            firstTurn: firstTurn === 1,
            startCards: id === players[1].id ? generateStartCards() : null
        };


        io.sockets.in(`room-${roomNbr}`).emit("startGame", [firstPlayer, secondPlayer]);
        roomCreated = false;

        return userData;
    }

    static async cancelSearch(io, socket, data) {
        const decoded = await jsonwebtoken.verify(data, config.jswt.secretKey);
        matchQueue.removePlayerById(decoded.id);
    }
}

function generateStartCards() {
    const startCardArray = [];
    for (let i = 0; i < 3; i++) {
        let cardIndex = Math.floor(Math.random() * cardsDeck.cardsArray.length);
        startCardArray.push(cardsDeck.cardsArray[cardIndex]);
    }
    return startCardArray;
}

function findRoomByUserData(id, login) {
    for (const room of gameRooms)
        for (const player of room.players)
            if (player.id === id && player.login === login)
                return room;

    return null;
}
