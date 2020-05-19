const db = require('../util/config').firestore.collection("languages");

exports.getUserLanaguages = (req, res) => {
    let results = [];
    db.where("userId", "==", req.query.userId)
        .get()
        .then((data) => {
            data.forEach((doc) => {
                results.push({
                    languageId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(results);
        })
        .catch(err => console.error(err));
}

exports.addLanguage = (req, res) => {
    const newLanaguage = {
        name: req.body.name,
        userId: req.body.userId,
        createdAt: new Date().toISOString(),
    }

    db.add(newLanaguage).then(
        doc => {
            return res.json({
                message: `document ${doc.id} created successfully`
            })
        }
    ).catch(err => {
        return res.status(500).json({
            error: 'something went wrong'
        });
        console.error(err);
    })

}

exports.updateLanguage = (req, res) => {
    const newLanguage = {
        name: req.body.name,
    }

    db.doc(`/${req.query.languageId}`).update(newLanguage).then(
        doc => {
            return res.status(201).json({
                message: `document ${req.query.languageId} updated successfully`
            })
        }
    ).catch(err => {
        res.status(500).json({
            error: 'something went wrong'
        });
        console.error(err);
    })

}

exports.deleteLanguage = (req, res) => {


    db.doc(`/${req.query.languageId}`).delete().then(
        doc => {
            return res.json({
                message: `document ${req.query.languageId} deleted successfully`
            })
        }
    ).catch(err => {
        return res.status(500).json({
            error: 'something went wrong'
        });
        console.error(err);
    })

}