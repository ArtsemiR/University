const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');

const firestoreDB = firebaseAdmin.firestore();
const ratingRef = firestoreDB.collection('rating');

// http://localhost:3000/api/v1/rating/like
// {
//     "orderId": "1d4a97e0-6f52-11e9-93c7-0fd1c5faeeec",
//     "userId": "2fcccd10-6e54-11e9-8582-4150f32892d0"
// }
router.post('/like', function(req, res, next) {
    const userId = req.body.userId;
    const orderId = req.body.orderId;

    ratingRef.get(orderId)
        .then(function () {
            const likesRef = ratingRef.doc(orderId).collection('likes').doc('desc');
            const dislikesRef = ratingRef.doc(orderId).collection('dislikes').doc('desc');
            likesRef.get()
                .then( snapshot => {
                    const likesObj = JSON.parse(JSON.stringify(snapshot.data()));

                    dislikesRef.get().then(doc => {
                        const dislikesObj = JSON.parse(JSON.stringify(doc.data()));
                        if (dislikesObj.users.includes(userId)) {
                            dislikesRef.update( {
                                users: dislikesObj.users.remove(userId),
                                count: (dislikesObj.count - 1)
                            });
                        }
                    });

                    if (likesObj.users.includes(userId)) {
                        likesRef.update( {
                            users: likesObj.users.remove(userId),
                            count: (likesObj.count - 1)
                        });
                    } else {
                        likesRef.update( {
                            users: likesObj.users.concat(userId),
                            count: (likesObj.count + 1)
                        });
                    }

                    res.status(200).json({
                        code: "OK",
                        message: 'Like accepted'
                    })
                });
            })
            .catch( err => {
                res.status(500).json({
                    code: "ERR",
                    message: 'Set like error'
                });
                console.log(err);
            });
});

// http://localhost:3000/api/v1/rating/dislike
// {
//     "orderId": "1d4a97e0-6f52-11e9-93c7-0fd1c5faeeec",
//     "userId": "2fcccd10-6e54-11e9-8582-4150f32892d0"
// }
router.post('/dislike', function(req, res, next) {
    const userId = req.body.userId;
    const orderId = req.body.orderId;

    ratingRef.get(orderId)
        .then(function () {
            const likesRef = ratingRef.doc(orderId).collection('likes').doc('desc');
            const dislikesRef = ratingRef.doc(orderId).collection('dislikes').doc('desc');
            dislikesRef.get()
                .then( snapshot => {
                    const dislikesObj = JSON.parse(JSON.stringify(snapshot.data()));

                    likesRef.get().then(doc => {
                        const likesObj = JSON.parse(JSON.stringify(doc.data()));
                        if (likesObj.users.includes(userId)) {
                            likesRef.update( {
                                users: likesObj.users.remove(userId),
                                count: (likesObj.count - 1)
                            });
                        }
                    });

                    if (dislikesObj.users.includes(userId)) {
                        dislikesRef.update( {
                            users: dislikesObj.users.remove(userId),
                            count: (dislikesObj.count - 1)
                        });
                    } else {
                        dislikesRef.update( {
                            users: dislikesObj.users.concat(userId),
                            count: (dislikesObj.count + 1)
                        });
                    }

                    res.status(200).json({
                        code: "OK",
                        message: 'Disike accepted'
                    })
                });
        })
        .catch( err => {
            res.status(500).json({
                code: "ERR",
                message: 'Set dislike error'
            });
            console.log(err);
        });
});

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

module.exports = router;
