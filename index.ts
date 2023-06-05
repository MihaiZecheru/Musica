const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const ytdl = require('ytdl-core');
const express = require("express");
const app = express();
const PORT = 3500;

app.use(favicon(__dirname + '/static/icon.ico'));
const jsonParser = bodyParser.json();

app.use('/mdbootstrap/*', (req: any, res: any) => {
  return res.sendFile(__dirname + req.originalUrl);
});

app.use('/pages/*', (req: any, res: any) => {
  return res.sendFile(__dirname + req.originalUrl);
});

// -----------------------------------------------------------------

import Database, { Table, TEntry } from "./mdb_local/index";
import { TUser } from "./types";
Database.connect();

// -----------------------------------------------------------------

Database.set_table_parse_function("Users", (entry: TEntry): TUser => {
  return {
    id: entry.id,
    email: entry.email,
    password: entry.password,
    created_on: new Date(entry.created_on)
  };
});

// -----------------------------------------------------------------

let users_logged_in: { [email: string]: boolean } = {};

// -----------------------------------------------------------------

function login_required(req: any, res: any) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  return users_logged_in[ip] === undefined;
}

function get_ip(req: any) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

function logout(ip: string) {
  delete users_logged_in[ip];
}

app.get("/", (req: any, res: any) => {
  if (login_required(req, res)) return res.redirect("/login");
  return res.sendFile("/pages/index/index.html", { root: __dirname });
});

app.get("/login", (req: any, res: any) => {
  logout(get_ip(req));
  return res.sendFile("/pages/login/index.html", { root: __dirname });
});

app.post("/login", jsonParser, (req: any, res: any) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const { email, password } = req.body;

  if (email == undefined || password == undefined) {
    return res.status(400).send("Email or password not provided");
  }

  const user = Database.get_where("Users", "email", email)[0];
  if (user == undefined) return res.status(400).send(`User with email "${email}" does not exist`);
  if (user.password != password) return res.status(400).send("Password invalid");
  
  users_logged_in[ip] = true;
  return res.status(200);
});

app.get("/register", (req: any, res: any) => {
  logout(get_ip(req));
  return res.sendFile("/pages/register/index.html", { root: __dirname });
});

app.get("/song/:id", async (req: any, res: any) => {
  if (login_required(req, res)) return res.redirect("/login");

  const info = await ytdl.getInfo(req.params.id);
  const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
  return res.send(audioFormats[0].url);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
