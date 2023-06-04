const fs = require('fs');
const https = require('https');
const favicon = require('serve-favicon');
const ytdl = require('ytdl-core');
const express = require("express");
const app = express();
const PORT = 3500;

app.use(favicon(__dirname + '/static/icon.ico'));

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

let users_logged_in: { [ip: string]: boolean } = {};

// -----------------------------------------------------------------

app.get("/", (req: any, res: any) => {
  if (users_logged_in[req.ip] == undefined) return res.redirect("/login");
  return res.sendFile("/pages/index/index.html", { root: __dirname });
});

app.get("/login", (req: any, res: any) => {
  return res.sendFile("/pages/login/index.html", { root: __dirname });
});

app.post("/login", (req: any, res: any) => {
  const { email, password } = req.query;
  console.log(email, password)  
  if (email == undefined || password == undefined) {
    return res.status(400).send("Email or password not provided");
  }
  
  const user = Database.get_where("Users", "email", email)[0];
  if (user == undefined) return res.status(400).send("Email invalid");
  if (user.password != password) return res.status(400).send("Password invalid");

  users_logged_in[req.ip] = true;
  return res.status(200);
});

app.get("/register", (req: any, res: any) => {
  return res.sendFile("/pages/register/index.html", { root: __dirname });
});

app.get("/song/:id", async (req: any, res: any) => {
  const info = await ytdl.getInfo(req.params.id);
  const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
  return res.send(audioFormats[0].url);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
