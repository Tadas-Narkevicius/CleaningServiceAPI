import { HttpRoute } from "./HttpRoute";
import { Express, Request, Response } from "express";
import { User } from "../models/User";
import { HttpError, HttpStatusCode} from "../http/HttpError";
import { Utility } from "../models/Utility";


export class RegisterRoute extends HttpRoute {
    setup(express: Express): void {
        express.post(`${this.path}`, this.addUser.bind(this));
    }

    addUser(request: Request, response: Response): void {
        let newUser = new User();
        newUser.username = request.body.username;
        newUser.email = request.body.email;
        newUser.password = request.body.password;

        if (!Utility.ValidateName(newUser.username)) {
            response.status(HttpStatusCode.BadRequest);
            response.send(new HttpError('Invalid name'));
        }

        if (!Utility.ValidateEmail(newUser.email)) {
            response.status(HttpStatusCode.BadRequest);
            response.send(new HttpError('Invalid email', HttpStatusCode.Forbidden));
            return;
        }

        if (!newUser.password || newUser.password.length < 4) {
            response.status(HttpStatusCode.BadRequest);
            response.send(new HttpError('Password is too short', HttpStatusCode.Forbidden));
            return;
        }

        newUser.password = User.EncryptPassword(newUser.password);

        User.GetUserByEmail(newUser.email)
            .then((users: any) => {
                if (users.length > 0) {
                    response.status(HttpStatusCode.Conflict);
                    response.send(new HttpError('User with this email already exists', HttpStatusCode.Conflict));
                } else {
                    User.AddUser(newUser)
                        .then(() => {
                            delete newUser.password;
                            response.status(HttpStatusCode.Created);
                            response.send(newUser);
                        })
                        .catch((err: HttpError) => {
                            response.status(err.code);
                            response.send(err);
                        });
                }
            })
            .catch((error: HttpError) => {
                response.status(error.code);
                response.send(error);
            });
    }
}