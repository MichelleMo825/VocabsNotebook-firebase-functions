const admin = require('../util/config').admin
const db = require("../util/config").firestore.collection("users")

module.exports = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split('Bearer ')[1];

    } else {
        console.error('No token found')
        return res.status(403).json({
            error: 'Unauthorized'
        })
    }


    admin.auth().verifyIdToken(token).then(
            decoded => {
                // console.log(decoded)
                req.user = decoded;
                return db.where("userId", "==", req.user.uid).limit(1).get()


            }
        ).then(
            data => {

                req.user.username = data.docs[0].data().username;
                return next();
            }
        )
        .catch(err => {
            console.error("Error while verifying token", err);
            return res.status(403).json(err)
        })

}