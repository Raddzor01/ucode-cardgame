import { connectToDatabase } from "../db/db.js";

export default class Model {

    constructor(table) {
        this.table = table;
    }

    async save(data) {

    }

    async find(id) {
        const sql = 'SELECT * FROM ' + this.table + ' WHERE id = ' + id + ';';
        const connection = connectToDatabase();
        const data = await connection.promise().query(sql);
        connection.end();
        return data;
    }

    async delete(id) {

    }
}