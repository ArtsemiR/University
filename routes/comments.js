const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');

const firestoreDB = firebaseAdmin.firestore();
const commentsRef = firestoreDB.collection('comments');

// api/v1/comments/add
// {
//     "orderId": "afe4a6d0-73ea-11e9-9900-6d5e200ba1d4",
//     "userId": "0bcc2550-6f17-11e9-8167-11d0fdd90876",
//     "message": "Message text"
// }
router.post('/add', function(req, res, next) {
    const uuidv1 = require('uuid/v1');
    const commentId = uuidv1();
    if (req.body.orderId == null,
    req.body.userId == null,
    req.body.message == null) {
        res.status(200).json({
            message: 'Comment body is not full',
        });
        return;
    }
    commentsRef.doc(req.body.orderId).collection('messages').doc(commentId).set({
        commentId: commentId,
        userId: req.body.userId,
        message: req.body.message
    })
        .then(function() {
            res.status(200).json({
                code: "OK",
                message: 'Comment added successfully'
            });
        })
        .catch( err => {
            res.status(500).json({
                code: "ERR",
                message: 'Create comment error'
            });
            console.log(err);
        });
});

// api/v1/comments/remove?orderId=d86ad0a0-6f4b-11e9-89a3-4ff3fd2b60a3&commentId=d86ad0a0-6f4b-11e9-89a3-4ff3fd2b60a3
router.post('/remove', function(req, res, next) {
    const orderId = req.query.orderId;
    const commentId = req.query.commentId;
    commentsRef.doc(orderId).collection('messages').doc(commentId).delete()
        .then(
            res.status(200).json({
                code: "OK",
                message: 'Comment deleted'
            })
        )
        .catch(
            res.status(500).json({
                code: "ERR",
                message: 'Comment remove error'
            })
        );
});

module.exports = router;