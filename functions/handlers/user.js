const auth = require('../util/config').auth;
const storage = require('../util/config').storage;
const config = require('../util/config').config;
const db = require('../util/config').firestore.collection("users");
const validator = require('../util/validator');

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username,
    }
    const {
        errors,
        valid
    } = validator.validateSignupData(newUser);

    if (!valid) return res.status(400).json(errors);
    const imageFileName = 'blank-profile-picture-973460_640.png';
    let token, userId;
    db.doc(`/${newUser.username}`).get().then(doc => {
            if (doc.exists) {
                return res.status(400).json({
                    username: 'this username is already taken'
                });

            } else {
                return auth.createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken()

        })
        .then(_token => {
            token = _token;
            const userCredential = {
                username: newUser.username,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId: userId,
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            }

            return db.doc(`${newUser.username}`).set(userCredential);
        })
        .then(() => {
            res.status(201).json({
                token
            })
        })

        .catch(err => {
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).json({
                    email: 'email is already in use'
                })
            } else {
                return res.status(500).json({
                    error: err.code
                })
            }

        });

}

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    const {
        errors,
        valid
    } = validator.validateLoginData(user);

    if (!valid) return res.status(400).json(errors);

    auth.signInWithEmailAndPassword(user.email, user.password).then(
            data => {
                return data.user.getIdToken();
            }
        ).then(token => {
            return res.json({
                token
            });

        })
        .catch(err => {
            if (err.code === "auth/wrong-password") {
                return res.status(403).json({
                    error: "wrong credential, please try again"
                })
            } else {
                return res.status(500).json({
                    error: err.code
                })
            }
        });

}

exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({
        headers: req.headers
    });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).json({
                error: "Wrong file type submitted"
            });
        }
        // my.image.png => ['my', 'image', 'png']
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        // 32756238461724837.png
        imageFileName = `${Math.round(
          Math.random() * 1000000000000
        ).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {
            filepath,
            mimetype
        };
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on("finish", () => {
        storage.bucket().upload(
            imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype,
                    }

                }
            }
        ).then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

            return db.doc(`/${req.user.username}`).update({
                imageUrl: imageUrl
            })
        }).then(() => {
            return res.json({
                message: 'Image uploaded successfully'
            });

        }).catch(err => {
            return res.status(500).json({
                error: err.code
            })
        });
    });
    busboy.end(req.rawBody);
};