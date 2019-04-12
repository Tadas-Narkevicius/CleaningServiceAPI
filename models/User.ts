import {MysqlError} from "mysql";
import {Database} from "../models/Database";
import {HttpError, HttpStatusCode} from "../http/HttpError";
import {Utility} from "../models/Utility";
import * as bcrypt from 'bcrypt-nodejs';
import {Request} from "express";

export class User {
    id: number;
    username: string;
    email: string;
    password: string;
    date: string;

    // Idėsi id ir gausi visus userius masyve.
    public static GetUserById(id: number): Promise<HttpError | any[]> {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM user WHERE id='${id}'`;

            Database.instance.connection.query(sql, (err: MysqlError, result: any[]) => {
                if (err) {
                    console.log(err);
                    reject(new HttpError('DB Error'));
                } else {
                    if (result.length > 0)
                        resolve(result);
                    else
                        reject(new HttpError('User not found', HttpStatusCode.NotFound));
                }
            });
        });
    }

    // Prides userį į duomenu baze.
    public static AddUser(user: User): Promise<MysqlError | undefined> {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO user (username, email, password) VALUES ('${user.username}', '${user.email}', '${user.password}')`;

            Database.instance.connection.query(sql, (err: MysqlError) => {
                if (err) {
                    reject(new HttpError(err.code));
                } else {
                    resolve();
                }
            });
        });
    }

    // Užkoduos paswordą.
    public static EncryptPassword(password: string): string {
        return bcrypt.hashSync(password);
    }

    // Paduodi į funkciją email, jeigu email atitiks duomenų bazeje esantį email, grazins mayvą su is name email.
    public static GetUserByEmail(email: string): Promise<HttpError | any[]> {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM user WHERE email='${email}'`;

            Database.instance.connection.query(sql, (err: MysqlError, result: any[]) => {
                if (err) {
                    console.log(err);
                    reject(new HttpError('DB Error'));
                } else {
                    resolve(result);
                }
            });
        });
    };

    // patikris Token 
    public static ValidateToken(request: Request): Promise<User | HttpError> {
        return new Promise((resolve, reject) => {

            // Getting authorization header
            let token = request.headers.authorization;
            console.log(token);

            if (!token) {
                throw new HttpError('Token is not provided', HttpStatusCode.BadRequest);
            }

            // Extracting JWT token
            token = token.split(' ')[1];

            // Verifying JWT token
            let decoded = Utility.VerifyToken(token);

            if (!decoded) {
                throw new HttpError('Token is not valid', HttpStatusCode.Unauthorized);
            } else {
                User.GetUserById(decoded.userId)
                    .then((users: any[]) => {
                        resolve(users[0]);
                    })
                    .catch(() => {
                        reject(new HttpError('User not found', HttpStatusCode.NotFound));
                    });
            }
        });
    }
}
