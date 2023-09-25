import mysql from 'mysql2';
import Model from "./Model.js";

export default class User extends Model {
    constructor(table) {
        super(table);
    }

    async find(id) {
        const data = await super.find(id);
        this.id = data[0].id;
        this.login = data[0].login;
        this.password = data[0].password;
        this.username = data[0].username;
        this.email = data[0].email;
        this.role = data[0].role;
        return this;
    }
}