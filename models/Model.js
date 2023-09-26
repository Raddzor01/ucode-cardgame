import { connectToDatabase } from "../db/db.js";

export default class Model {

    constructor(table) {
        this.table = table;
    }

    async save(data) {
        const propertyNames = [];
        const propertyValues = [];
        for(const property in data) {
            if (property !== "id") {
                propertyNames.push(property);
                propertyValues.push(data[property]);
            }
        }
        const sql = `INSERT INTO ${this.table} (${propertyNames}) VALUES (${propertyValues});`;
        const db = connectToDatabase();
        let res = await db.promise().query(sql).catch((reason) => {
            return reason.sqlMessage;
        });
        db.end();

        if (typeof res === 'string')
            return res;

        if(!data.id)
            return res[0].insertId;

        return res[0].affectedRows;
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

    async exists(data) {
        const sql = 'SELECT * FROM ' + this.table + ' WHERE ' + data.name + ' = \'' + data.value + '\';';
        const db = connectToDatabase();
        const result = await db.promise().query(sql);
        db.end();
        return !!result[0].length;
    }
}