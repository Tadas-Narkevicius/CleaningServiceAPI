"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var Database = /** @class */ (function () {
    // Construktorius sukonektina DB.
    function Database() {
        this.connect();
    }
    Object.defineProperty(Database, "instance", {
        // Creating object for Database.
        get: function () {
            if (!Database._instance)
                Database._instance = new Database();
            return Database._instance;
        },
        enumerable: true,
        configurable: true
    });
    Database.prototype.connect = function () {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        this.connection.connect(function (err) {
            if (err) {
                console.log('Cannot connect to database');
                console.log(err.message);
            }
            else {
                console.log('Connected to DB');
            }
        });
    };
    return Database;
}());
exports.Database = Database;
