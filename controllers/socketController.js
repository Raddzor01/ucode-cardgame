import jsonwebtoken from "jsonwebtoken";

import config from "../config.json" assert { type: 'json' };
import User from '../models/User.js';
import Card from "../models/Card.js";
import { MatchQueue } from "../utils/utils.js";

let roomNbr = 0;
let gameRooms = [];

const cardsDeck = new Card();
cardsDeck.getAllCards();

const matchQueue = new MatchQueue();

export default class socketController {
    static async getUserData(io, socket, data) {
        try {
            const newUser = new User();
            const { id } = await jsonwebtoken.verify(data, config.jswt.secretKey);

            await newUser.find(id);
            const userData = {
                login: newUser.login,
                id: newUser.id,
                picture: newUser.picture_path,
                wins: newUser.wins,
                loses: newUser.loses
            };

            socket.emit("userData", userData);

            userData.socket = socket;
            userData.roomNbr = -1;
            userData.hp = 30;
            userData.mana = 2;
            userData.cards = 27;

            return userData;
            } catch (err) {
                throw err;
            }
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
            userData.roomNbr = roomNbr;
            gameRooms[roomNbr] = {
                players: [],
                inCreating: true,
                gameTurn: 0,
                mana: 1
            }
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
            startCards: generateStartCards()
        }));

        io.sockets.in(`room-${roomIndex}`).emit("startGame", playersData);

        return userData;
    }

    static async attack(io, socket, data, userData) {
        const { ownSlotIndex, ownCardId, enemySlotIndex } = data;
        const currentRoom = gameRooms[userData.roomNbr];
        const playerIndex = currentRoom.players.findIndex((player) => player.id === userData.id);
        const enemyIndex = 1 - playerIndex;

        if (enemySlotIndex === -1) {
            const player = currentRoom.players[playerIndex];
            const enemy = currentRoom.players[enemyIndex];

            player.hp -= cardsDeck.cardsArray[ownCardId - 1].damage;

            if (player.hp <= 0) {
                io.to(player.socket.id).emit("youWin");
                io.to(enemy.socket.id).emit("youLose");

                await updateGameResults(player, enemy);
                gameRooms.splice(userData.roomNbr, 1);
            }
        }

        socket.to(`room-${userData.roomNbr}`).emit("enemyAttack", { userCardIndex: enemySlotIndex, enemyCardIndex: ownSlotIndex });
    }

    static async placeCard(socket, data, gameRoomNbr) {
        const card = cardsDeck.cardsArray[data.cardId - 1];
        // console.log(data);
        socket.to(`room-${gameRoomNbr}`).emit("placeEnemyCard", { card: card, slotId: data.slotId } );
    }

    static async endTurn(io, socket, userData){
        const room = gameRooms[userData.roomNbr];
        const newCardIndex = Math.floor(Math.random() * cardsDeck.cardsArray.length);
        if(userData.cards-- > 0)
            io.to(socket.id).emit("getNewCard", cardsDeck.cardsArray[newCardIndex]);
        socket.to(`room-${userData.roomNbr}`).emit("changeTurn", { mana: room.mana });
        room.gameTurn++;
        if (room.gameTurn % 2 === 1 && room.mana < 10)
                room.mana++;
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

async function updateGameResults(player, enemy) {
    const newUser = new User();

    await newUser.updateField({ id: player.id, name: 'wins', value: ++player.wins });
    await newUser.updateField({ id: enemy.id, name: 'loses', value: ++enemy.loses });
}

