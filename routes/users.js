const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');

const firestoreDB = firebaseAdmin.firestore();
const usersRef = firestoreDB.collection('users');

// http://localhost:3000/api/v1/orders/add
// {
//     "firstName": "Andrey",
//     "lastName": "Chernenko",
//     "nick": "neo",
//     "birthDate": "19.10.1996",
//     "email": "andns@mail.ru",
//     "phone": "+375293429733",
//     "userRole": "user"
// }
router.post('/add', function(req, res, next) {
    const uuidv1 = require('uuid/v1');
    const userId = uuidv1();
    if (req.body.firstName == null,
        req.body.lastName == null,
        req.body.email == null,
        req.body.phone == null,
        req.body.userRole == null) {
        res.status(200).json({
            message: 'User profile is not full',
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

// http://localhost:3000/api/v1/users/remove/id
router.post('/remove/:userId', function(req, res, next) {
    const id = req.params.userId;
    var queryRef = usersRef.where('userId', '==', id);
    queryRef.get()
        .then(doc => {
            if (doc.empty) {
                res.status(200).json({
                    message: 'User does not exist'
                });
                return;
            }

            usersRef.doc(id).delete()
                .then(doc => {
                    if (doc.empty) {
                        res.status(200).json({
                            message: 'User not removed'
                        });
                        return;
                    }

                    res.status(200).json({
                        message: 'User removed'
                    })
                })
        })
        .catch( err => {
            res.status(500).json({
                message: 'User remove error'
            });
            console.log(err);
        })
});

//http://localhost:3000/api/v1/users/all
router.get('/all', function(req, res, next) {
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

// http://localhost:3000/api/v1/users/user/0e34ef60-6e50-11e9-a578-89b89011cd2f
router.get('/user/:userId', function(req, res, next) {
    const id = req.params.userId;
    var queryRef = usersRef.where('userId', '==', id);
    queryRef.get()
        .then(doc => {
            const user = getUser(id, doc);
            if (user == null) {
                res.status(200).json({
                    message: 'No users with such id'
                });
                return;
            }

            res.status(200).json({
                message: null,
                user: user
            });
        })
        .catch( err => {
            res.status(500).json({
                message: 'Error getting user by id'
            });
            console.log(err);
        })
});

function getUser(id, doc) {
    const users = doc.docs.map(function (user) { return user.data() });
    if (!users.empty) {
        return users[0]
    } else {
        return null
    }
}

module.exports = router;
