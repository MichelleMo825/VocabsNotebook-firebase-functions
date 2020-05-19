const {
    auth
} = require('../util/config');

const db = require('../util/config').firestore.collection("users");
const validator = require('../util/validator');

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username,
    }

    //TODO validate data
    let errors = {}
    if (validator.isEmpty(newUser.email)) {
        errors.email = 'Must not be empty'
    } else if (!validator.isEmail(newUser.email)) {
        errors.email = 'Must be a valid email address'
    }

    if (validator.isEmpty(newUser.password)) errors.password = 'Must not be empty'
    if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match'
    if (validator.isEmpty(newUser.username)) errors.username = 'Must not be empty'

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }
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

    let errors = {};
    if (validator.isEmpty(user.email)) errors.email = 'Must not be empty';
    if (validator.isEmpty(user.password)) errors.password = 'Must not be empty';

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

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