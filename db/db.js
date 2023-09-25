import mysql from 'mysql2';
import config from '../config.json' assert { type: 'json' };

export function connectToDatabase() {
    const db = mysql.createConnection(config.db);
    db.connect((err) => {
        if (err) return console.error("Error: " + err.message);
    });
    return db;
}