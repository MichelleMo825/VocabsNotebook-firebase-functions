const db = require('../util/config').firestore.collection("notes");


exports.getLanguagesNote = (req, res) => {
    let results = [];
    db.where("languageId", "==", req.query.languageId)
        .get()
        .then((data) => {
            data.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return res.json(results);
        })
        .catch(err => console.error(err));
}

exports.addNote = (req, res) => {
    const newNote = {
        content: req.body.content,
        languageId: req.body.languageId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    db.add(newNote).then(
        doc => {
            return res.json({
                message: `document ${doc.id} created successfully`
            })
        }
    ).catch(err => {
        res.status(500).json({
            error: 'something went wrong'
        });
        console.error(err);
    })

}

exports.updateNote = (req, res) => {
    const newNote = {
        content: req.body.content,
        languageId: req.body.languageId,
        updatedAt: new Date().toISOString(),
    }

    db.doc(`/${req.query.noteId}`).update(newNote).then(
        doc => {
            return res.json({
                message: `document ${req.query.noteId} updated successfully`
            })
        }
    ).catch(err => {
        return zwHRgjNceHpXaBrXfZfnres.status(500).json({
            error: 'something went wrong'
        });
        console.error(err);
    })

}

exports.deleteNote = (req, res) => {


    db.doc(`/${req.query.noteId}`).delete().then(
        doc => {
            return res.json({
                message: `document ${req.query.noteId} deleted successfully`
            })
        }
    ).catch(err => {
        return res.status(500).json({
            error: 'something went wrong'
        });
        console.error(err);
    })

}