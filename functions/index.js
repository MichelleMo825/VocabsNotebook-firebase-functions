const functions = require("firebase-functions");
const app = require("express")();

//handlers
const languages = require("./handlers/languages");
const notes = require("./handlers/notes");
const users = require("./handlers/user");

//sign up route
app.post('/signup', users.signup);
app.post('/login', users.login);
//languages route
app.get("/languages", languages.getUserLanaguages);
app.post("/language", languages.addLanguage);
app.put("/language", languages.updateLanguage);
app.delete("/language", languages.deleteLanguage);


//notes route
app.get("/notes", notes.getLanguagesNote);
app.post("/note", notes.addNote);
app.put("/note", notes.updateNote);
app.delete("/note", notes.deleteNote);

exports.api = functions.https.onRequest(app);