import { HttpError } from './../http/HttpError';
import { Database } from "../models/Database";
import { MysqlError } from "mysql";

export class Advert {
    id: number;
    title: string;
    price: number;
    address: string;
    phone: number;
    discription: string;
    userId: number;

    static GetAdvertByAdvertID(advertId: number): Promise< Advert[] | HttpError> {
        return new Promise((resolve, reject) => {
            Database.instance.connection.query(`SELECT * FROM advert WHERE id =${advertId}`, (err: MysqlError, response: any) => {
                if (err) {
                    reject(new HttpError('Internal server error'));
                } else {
                    resolve(response);
                }
            });
        });
    }

    static GetAdvertsByTitle(title: string): Promise< Advert[] | HttpError> {
        return new Promise((resolve, rejects) => {
            let sql = `SELECT * FROM advert WHERE title LIKE '${title}%'`;
            Database.instance.connection.query(sql, (err: MysqlError, result: any) => {
                if(err) {
                    rejects(new HttpError('Unable to get advert'));
                } else {
                    resolve(result);
                }
            })
        });
    }

    static GetAllAdverts(): Promise< Advert[] | HttpError> {
        return new Promise((resolve, rejects) => {
            Database.instance.connection.query(`SELECT * FROM advert`, (err: MysqlError, result: any) => {
                if (err) {
                    rejects(new HttpError('Unable to get advert'));
                } else {
                    resolve(result);
                }
            });
        });
    }

    // TODO: do search and replace or GetAdverts(
    static GetAdvertsByUserID(userId: number): Promise< Advert[] | HttpError> {
        return new Promise((resolve, reject) => {
            Database.instance.connection.query(`SELECT * FROM advert WHERE userId =${userId}`, (err: MysqlError, response: any) => {
                if (err) {
                    reject(new HttpError('Internal server error'));
                } else {
                    resolve(response);
                }
            });
        });
    }

    static GetAdvertByUserIdAndAdvertId(userId: number, adId: number): Promise<Advert | HttpError> {
        return new Promise((resolve, reject) => {
            // console.log(">> userId: " + userId + " :: adId:" + adId);
            Database.instance.connection.query(`SELECT * FROM advert WHERE id = ${adId} AND userId = ${userId}`,
                (err: MysqlError, response: any) => {
                if (err) {
                    reject(new HttpError('Internal server error'));
                } else {
                    resolve(response);
                }
            });
        });
    }

    // Prideda advert į duomenu baze.
    static AddAdvert(advert: Advert): Promise<boolean | HttpError> {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO advert (title, price, address, phone, discription, userId) VALUES
            ('${advert.title}', '${advert.price}', '${advert.address}', ${advert.phone}, '${advert.discription}', ${advert.userId})`;
            Database.instance.connection.query(sql, (err: MysqlError) => {
                if (err) {
                    console.log(err);
                    reject(new HttpError('DB error'));
                } else {
                    resolve(true);
                }
            });
        });
    }

    // Istrinsi advert pagal userId
    static DeleteAdvert(advertId: number): Promise<boolean | HttpError> {
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM advert WHERE id = ${advertId}`;
            Database.instance.connection.query(sql, (err: MysqlError) => {
                if (err)
                    reject(new Error('Database error'));
                else
                    resolve(true);
            });
        });
    }

    // advert objektas paduodamas į UpdateAdvert()
    static UpdateAdvert(advert: Advert): Promise<boolean | HttpError> {
        return new Promise((resolve, reject) => {
            let sql = `UPDATE advert SET 
                            title = '${advert.title}',
                            price = '${advert.price}',
                            address = '${advert.address}',
                            phone = ${advert.phone},
                            discription = '${advert.discription}' 
                        WHERE id = ${advert.id}`;
            Database.instance.connection.query(sql, (err: MysqlError, result: any) => {
                if (err)
                    reject(new Error('Database error'));
                else {
                    resolve(true);
                }
            });
        });
    }
}