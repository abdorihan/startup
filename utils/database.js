import mysql from 'mysql';

export default class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ispdb'
        });
        this.connection.connect((err) => {
            if (err) {
                console.error(`error connecting to database: ${err.stack}`);
                throw err;
            }
        });
    }
    query (sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
    selectAll (table) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM \`${table}\``;
            this.connection.query(sql, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
    selectOne (table, col, value) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM \`${table}\` WHERE ${col} = ?`;
            this.connection.query(sql, value, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    insert (table, data) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO \`${table}\` values ?`;
            this.connection.query(sql, [data], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
    insertOne (table, element) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO \`${table}\` SET ?`;
            this.connection.query(sql, element, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
    update (table, data, id) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE \`${table}\` SET ? WHERE ?`;
            this.connection.query(sql, [data, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
    delete (table, id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM \`${table}\` WHERE ?`;
            this.connection.query(sql, id, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}
