import {HttpServer} from "./http/HttpServer";
import * as dotenv from 'dotenv';

dotenv.config();

let httpServer = new HttpServer(Number(process.env.PORT));

