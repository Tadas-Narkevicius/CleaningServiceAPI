import { Connection, MysqlError } from "mysql";
import * as mysql from 'mysql';

export class Database {
    public connection: Connection;

    // Singleton pattern
    private static _instance: Database;

    // Creating object for Database.
    static get instance(): Database {
        if (!Database._instance)
            Database._instance = new Database();
        return Database._instance;
    }

    // Construktorius sukonektina DB.
    constructor() {
        this.connect();
    }

    connect(): void {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        
        this.connection.connect((err: mysql.MysqlError | null) => {
            if(err){
                console.log('Cannot connect to database');
                console.log(err.message);
            } else {
                console.log('Connected to DB');
            }
        });
    }
}

