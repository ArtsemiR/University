var express = require('express');
var router = express.Router();

const admin = require('firebase-admin');
var serviceAccount = require('../university-26e9c-firebase-adminsdk-yufum-be1090d3a3');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var firestoreDB = admin.firestore();
var usersRef = firestoreDB.collection('users');

//http://localhost:3000/users/all
router.get('/all', (req, res, next) => {
  usersRef.get()
      .then(doc => {
        if (doc.empty) {
            res.status(200).json({
                message: 'no users'
            });
            return;
        }

        res.status(200).json({
          message: null,
          users: doc.docs.map(function (user) {
              return user.data();
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error getting users'
        });
        console.log(err);
      });
});

// http://localhost:3000/users/first
router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    var queryRef = usersRef.where('userId', '==', id);
    queryRef.get()
        .then(doc => {
            if (doc.empty) {
                res.status(200).json({
                    message: 'No users with such id'
                });
                return;
            }

            res.status(200).json({
                message: null,
                users: doc.docs.map(function (user) {
                    return user.data();
                })
            });
        })
        .catch( err => {
            res.status(500).json({
                message: 'Error getting user by id'
            });
            console.log(err);
        })
});

module.exports = router;
