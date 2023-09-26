import mysql from 'mysql2';
import Model from "./Model.js";
import {connectToDatabase} from "../db/db.js";

export default class User extends Model {
    constructor(table) {
        super(table);
    }

    async save(data) {
        let result = await super.save(data);
        if(typeof result === "number")
            return this.find(result);
    }

    async find(id) {
        const data = await super.find(id);
        this.id = data[0].id;
        this.login = data[0].login;
        this.password = data[0].password;
        this.username = data[0].username;
        this.email = data[0].email;
        this.role = data[0].role;
    }

    async check(data) {
        const sql = 'SELECT * FROM ' + this.table + ' WHERE login=\''+ data.login + '\' AND password=\'' + data.password +'\';';
        const db = connectToDatabase();
        let result = await db.promise().query(sql);
        db.end();
        if (result[0].length)
            return result[0][0].id;
        return -1;
    }
}