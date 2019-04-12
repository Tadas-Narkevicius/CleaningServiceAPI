"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpServer_1 = require("./http/HttpServer");
var dotenv = require("dotenv");
dotenv.config();
var httpServer = new HttpServer_1.HttpServer(Number(process.env.PORT));
