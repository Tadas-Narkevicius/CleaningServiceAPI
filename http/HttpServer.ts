import {Express} from "express";
import * as express from 'express';
import { AdvertRoute } from "../http/AdvertRoute";
import { RegisterRoute } from "../http/RegisterRoute";
import { LoginRoute } from "../http/LoginRoute";

export class HttpServer {
    private express: Express;

    constructor(port: number) {
        this.express = express();
        

        let bodyParser = require('body-parser');
        this.express.use(bodyParser.json());

        let cors = require('cors');
        this.express.use(cors());

        this.setupRoutes();

        this.express.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }   
    
    private setupRoutes(): void {
        new RegisterRoute('/register', this.express);
        new LoginRoute('/login', this.express);
        new AdvertRoute('/advert', this.express);
    }
}
