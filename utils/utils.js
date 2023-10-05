import jsonwebtoken from "jsonwebtoken";
import mysql from 'mysql2';
import config from '../config.json' assert { type: 'json' };

const matchQueue = [];

export class MatchQueue {
    enqueue(player) {
        matchQueue.push(player);
    }
    dequeue() {
        return matchQueue.shift();
    }
    getLength() {
        return matchQueue.length;
    }

    removePlayerById(id) {
        const index = matchQueue.findIndex(player => player.id === id);
        if (index !== -1) {
            matchQueue.splice(index, 1);
            return true;
        }
        return false;
    }
}

export function checkToken(req, res, next) {
    let token = req.cookies.token;
    if (!token)
        return res.redirect("/login");
    jsonwebtoken.verify(token, "securepass", (err, decoded) => {
        if (err) {
            res.status(403).clearCookie('token').redirect("/login");
            return;
        }
        req.user = decoded;
        next();
    });
}

export function connectToDatabase() {
    const db = mysql.createConnection(config.db);
    db.connect((err) => {
        if (err) return console.error("Error: " + err.message);
    });
    return db;
}