import jsonwebtoken from "jsonwebtoken";

import config from "../config.json" assert { type: 'json' };
import User from '../models/User.js';
import Card from "../models/Card.js";
import MatchQueue from "../utils/matchQueue.js";

let roomNbr = 0;
let gameRooms = [];

const cardsDeck = new Card();
cardsDeck.getAllCards();

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
                userData.mana = 2;

                resolve(userData);
            } catch (err) {
                reject(err);
            }
        });
    }

    static async findGame(io, socket, data, userData) {
        socket.join(`room-${roomNbr}`);
        userData.roomNbr = roomNbr;
        if(matchQueue.getLength() > 0) {
            matchQueue.dequeue();
            gameRooms[roomNbr].players.push(userData);
            io.sockets.in(`room-${roomNbr}`).emit("toGame", "game");
            roomNbr++;
        } else {
            gameRooms[roomNbr] = {players: []};
            userData.roomNbr = roomNbr;
            gameRooms[roomNbr].inCreating = true;
            gameRooms[roomNbr].players.push(userData);
            matchQueue.enqueue(userData);
        }
        return userData;
    }

    static connectToRoom(io, socket, data, userData) {
        const { id, login } = jsonwebtoken.verify(data, config.jswt.secretKey);
        const foundRoom = findRoomByUserData(id, login);

        if(!foundRoom)
            return userData;

        let roomIndex = gameRooms.indexOf(foundRoom);

        gameRooms[roomIndex].players[gameRooms[roomIndex].players[0].id === userData.id ? 0 : 1].socket = socket;

        userData.roomNbr = roomIndex;
        userData.socket = socket;

        socket.join(`room-${roomIndex}`);

        if(foundRoom.inCreating === true) {
            gameRooms[roomIndex].inCreating = false;
            return userData;
        }

        const firstTurn = Math.floor(Math.random() * 2);

        const players = foundRoom.players;

        const playersData = players.map(player => ({
            login: player.login,
            wins: player.wins,
            profile_image: player.picture,
            firstTurn: firstTurn === players.indexOf(player),
            startCards: id === player.id ? generateStartCards() : null
        }));

        io.sockets.in(`room-${roomIndex}`).emit("startGame", playersData);

        return userData;
    }

    static async cancelSearch(io, socket, data) {
        const decoded = await jsonwebtoken.verify(data, config.jswt.secretKey);
        matchQueue.removePlayerById(decoded.id);
    }

    static async disconnect(io, socket, userData) {
        const newUser = new User();
        if(userData) {
            if(gameRooms[userData.roomNbr] && gameRooms[userData.roomNbr].inCreating === false) {
                let room = gameRooms[userData.roomNbr];
                let enemyPlayer = room.players[0].id === userData.id ? room.players[1] : room.players[0];

                if(enemyPlayer) {
                    await newUser.updateField({id: enemyPlayer.id, name: 'wins' , value: ++enemyPlayer.wins});
                    await newUser.updateField({id: userData.id, name: 'loses' , value: ++userData.loses});
                    io.to(enemyPlayer.socket.id).emit('youWin', {user: userData.login});
                }
                gameRooms.splice(userData.roomNbr, 1);
            }
        }
    }

    static async endTurn(io, socket, userData){
        const newCardIndex = Math.floor(Math.random() * cardsDeck.cardsArray.length);
        io.to(socket.id).emit("getNewCard", cardsDeck.cardsArray[newCardIndex]);
        socket.to(`room-${userData.roomNbr}`).emit("changeTurn", { mana: userData.mana === 10 ? 10 : ++userData.mana });
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
    for (const room of gameRooms) {
        if (room === undefined)
            continue;

        for (const player of room.players)
            if (player.id === id && player.login === login)
                return room;
    }


    return null;
}
