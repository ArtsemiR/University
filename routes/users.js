const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');

const firestoreDB = firebaseAdmin.firestore();
const usersRef = firestoreDB.collection('users');

// api/v1/users/add
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
    })
        .then(function() {
            res.status(200).json({
                code: "OK",
                message: 'User added successfully'
            });
        })
        .catch( err => {
            res.status(500).json({
                code: "ERR",
                message: 'Create user error'
            });
            console.log(err);
        })
});

// api/v1/users/remove?userId=d86ad0a0-6f4b-11e9-89a3-4ff3fd2b60a3
router.post('/remove', function(req, res, next) {
    const id = req.query.userId;
    usersRef.doc(id).delete()
        .then(
            res.status(200).json({
                code: "OK",
                message: 'User deleted'
            })
        )
        .catch( err => {
            res.status(500).json({
                code: "ERR",
                message: 'User remove error'
            });
            console.log(err);
        });
});

// api/v1/users/all
router.get('/all', function(req, res, next) {
  usersRef.get()
      .orderBy('lastName')
      .then(snapshot => {
        if (snapshot.empty) {
            res.status(200).json({
                code: "OK",
                message: 'no users'
            });
            return;
        }

        res.status(200).json({
            code: "OK",
            users: snapshot.docs.map(function (user) {
              return user.data();
          })
        });
      })
      .catch(err => {
        res.status(500).json({
            code: "ERR",
            message: 'Error getting users'
        });
        console.log(err);
      });
});

// api/v1/users?page1=3&size=10
router.get('/', function(req, res, next) {
    const page = req.query.page;
    const size = req.query.size;

    usersRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
                res.status(200).json({
                    code: "OK",
                    message: 'no users'
                });
                return;
            }

            if (((page - 1) * size) > (snapshot.docs.length - 1)) {
                res.status(200).json({
                    code: "OK",
                    message: 'users are over'
                });
                return
            }

            if ((page * size - 1) > (snapshot.docs.length - 1)) {
                usersRef
                    .orderBy('lastName')
                    .startAt(snapshot.docs[(page - 1) * size])
                    .endAt(snapshot.docs[snapshot.docs.length - 1])
                    .get().then( doc => {
                        res.status(200).json({
                            code: "OK",
                            users: doc.docs.map(function (user) {
                                return user.data();
                            })
                        });
                });
                return
            }

            usersRef
                .orderBy('lastName')
                .startAt(snapshot.docs[(page - 1) * size])
                .endAt(snapshot.docs[page * size - 1])
                .get().then( doc => {
                    res.status(200).json({
                        code: "OK",
                        users: doc.docs.map(function (user) {
                            return user.data();
                        })
                    });
                });

        })
        .catch(err => {
            res.status(500).json({
                code: "ERR",
                message: 'Error getting users'
            });
            console.log(err);
        });
});

// api/v1/users/user?userId=0e34ef60-6e50-11e9-a578-89b89011cd2f
router.get('/user', function(req, res, next) {
    const id = req.query.userId;
    usersRef.doc(id).get()
        .then( snapshot => {
            if (!snapshot.exists) {
                res.status(200).json({
                    message: 'No users with such id'
                });
                return;
            }

            res.status(200).json({
                code: "OK",
                user: snapshot.data()
            });
        })
        .catch( err => {
            res.status(500).json({
                code: "ERR",
                message: 'Error getting user by id'
            });
            console.log(err);
        })
});

module.exports = router;
