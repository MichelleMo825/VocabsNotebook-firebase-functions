const functions = require("firebase-functions");
const app = require("express")();
const FBauth = require("./util/authentication");


//handlers
const languages = require("./handlers/languages");
const notes = require("./handlers/notes");
const users = require("./handlers/user");

//sign up route
app.post('/signup', users.signup);
app.post('/login', users.login);
app.post('/user/image', FBauth, users.uploadImage);
//languages route
app.get("/languages", languages.getUserLanaguages);
app.post("/language", FBauth, languages.addLanguage);
app.put("/language", FBauth, languages.updateLanguage);
app.delete("/language", FBauth, languages.deleteLanguage);


//notes route
app.get("/notes", FBauth, notes.getLanguagesNote);
app.post("/note", FBauth, notes.addNote);
app.put("/note", FBauth, notes.updateNote);
app.delete("/note", FBauth, notes.deleteNote);

exports.api = functions.region('asia-east2').https.onRequest(app);