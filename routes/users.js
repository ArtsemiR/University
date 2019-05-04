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

// http://localhost:3000/users/add
// {
//     "firstName": "Andrey",
//     "lastName": "Chernenko",
//     "nick": "neo",
//     "birthDate": "19.10.1996",
//     "email": "andns@mail.ru",
//     "phone": "+375293429733",
//     "userRole": "user"
// }
router.post('/add', (req, res, next) => {
    const uuidv1 = require('uuid/v1');
    const userId = uuidv1();
    if (req.body.firstName == null,
        req.body.lastName == null,
        req.body.email == null,
        req.body.phone == null,
        req.body.userRole == null) {
        res.status(500).json({
            message: 'User model is not full',
        });
        return;
    }
    usersRef.doc(userId).set({
        userId: userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nick: req.body.nick,
        birthDate: req.body.birthDate,
        email: req.body.email,
        phone: req.body.phone,
        userRole: req.body.userRole
    }).
    then(doc => {
        if (doc.empty) {
            res.status(200).json({
                message: 'User not added'
            });
            return;
        }

        res.status(200).json({
            message: 'User added',
        });
    })
    .catch( err => {
        res.status(500).json({
            message: 'Create user error'
        });
        console.log(err);
    })
});

module.exports = router;
