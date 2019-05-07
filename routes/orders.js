const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');

const firestoreDB = firebaseAdmin.firestore();
const ordersRef = firestoreDB.collection('orders');
const ratingRef = firestoreDB.collection('rating');

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        var filetype = '';
        if(file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if(file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if(file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});

// api/v1/orders/uploadImage
router.post('/uploadImage',upload.single('image'),function(req, res, next) {
    console.log(req.file);
    if(!req.file) {
        res.status(500).json({
            code: 'ERR',
            message: 'Image load error',
            imageURL: 'localhost:3000/images/' + req.file.filename }
        );
        return next(err);
    }

    res.status(200).json({
        code: 'OK',
        message: 'Image has loaded',
        imageUrl: 'localhost:3000/images/' + req.file.filename}
    );
});

// api/v1/orders/add
// {
//     "userId": "2fcccd10-6e54-11e9-8582-4150f32892d0"
//     "photoURL": "localhost:3000/images/image-1557068309679.jpg",
//     "description": "Описание"
// }
router.post('/add', function(req, res, next) {
    const uuidv1 = require('uuid/v1');
    const orderId = uuidv1();
    if (req.body.userId == null,
        req.body.photoURL == null,
        req.body.description == null) {
        res.status(200).json({
            message: 'Order information is not full',
        });
        return;
    }
    ordersRef.doc(orderId).set({
        orderId: orderId,
        userId: req.body.userId,
        orderDate: new Date(),
        photoURL: req.body.photoURL,
        description: req.body.description
    })
        .then( function() {
                createRating(orderId);
                res.status(200).json({
                    code: "OK",
                    message: 'Order created'
                });
            }
        )
        .catch( err => {
            res.status(500).json({
                code: "ERR",
                message: 'Order create error'
            });
            console.log(err);
        })
});

function createRating(orderId) {
    ratingRef.doc(orderId).set({
        orderId: orderId
    });
    ratingRef.doc(orderId).collection('likes').doc('desc').set({
        users: [],
        count: 0
    });
    ratingRef.doc(orderId).collection('dislikes').doc('desc').set({
        users: [],
        count: 0
    });
}

// api/v1/orders/uploadImage
router.post('/remove', function(req, res, next) {
    const id = req.query.orderId;
    ordersRef.doc(id).delete()
        .then(function () {
            ratingRef.doc(id).delete();

            res.status(200).json({
                code: "OK",
                message: 'Order removed'
            })
        })
        .catch( err => {
            res.status(500).json({
                code: "ERR",
                message: 'Order remove error'
            });
            console.log(err);
        })
});

// api/v1/orders/all
router.get('/all', function(req, res, next) {
    ordersRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
                res.status(200).json({
                    code: "OK",
                    message: 'No orders'
                });
                return;
            }

            res.status(200).json({
                code: "OK",
                message: null,
                orders: snapshot.docs.map(function (order) {
                    return order.data();
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                code: "ERR",
                message: 'Error getting orders'
            });
            console.log(err);
        });
});

// api/v1/orders?page1=3&size=10
router.get('/', function(req, res, next) {
    const page = Number(req.query.page);
    const size = Number(req.query.size);

    ordersRef
        .orderBy('orderDate')
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                res.status(200).json({
                    code: "OK",
                    message: 'No orders'
                });
                return;
            }

            if (((page - 1) * size) > (snapshot.docs.length - 1)) {
                res.status(200).json({
                    code: "OK",
                    message: 'Orders are over'
                });
                return
            }

            if ((page * size - 1) > (snapshot.docs.length - 1)) {
                ordersRef
                    .orderBy('orderDate')
                    .startAt(snapshot.docs[(page - 1) * size])
                    .limit(size)
                    .get().then( doc => {
                    res.status(200).json({
                        code: "OK",
                        orders: doc.docs.map(function (user) {
                            return user.data();
                        })
                    });
                });
                return
            }

            ordersRef
                .orderBy('orderDate')
                .startAt(snapshot.docs[(page - 1) * size])
                .limit(size)
                .get().then( doc => {
                res.status(200).json({
                    code: "OK",
                    orders: doc.docs.map(function (user) {
                        return user.data();
                    })
                });
            });

        })
        .catch(err => {
            res.status(500).json({
                code: "ERR",
                message: 'Error getting orders'
            });
            console.log(err);
        });
});

//http://localhost:3000/api/v1/orders/user?userId=2fcccd10-6e54-11e9-8582-4150f32892d0
router.get('/user', function(req, res, next) {
    const id = req.query.userId;
    var queryRef = ordersRef.where('userId', '==', id);
    queryRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
                res.status(200).json({
                    code: "OK",
                    message: 'No orders with such user'
                });
                return;
            }

            res.status(200).json({
                code: "OK",
                message: null,
                orders: snapshot.docs.map(function (order) { return order.data() })
            });
        })
        .catch( err => {
            res.status(500).json({
                code: "ERR",
                message: 'Error getting order by id'
            });
            console.log(err);
        })
});

// api/v1/orders/order?orderId=0e34ef60-6e50-11e9-a578-89b89011cd2f
router.get('/order', function(req, res, next) {
    const id = req.query.orderId;
    ordersRef.doc('id').get()
        .then(snapshot => {
            if (!snapshot.exists) {
                res.status(200).json({
                    code: "OK",
                    message: 'No orders with such id'
                });
                return;
            }

            res.status(200).json({
                code: "OK",
                message: null,
                order: snapshot.data()
            });
        })
        .catch( err => {
            res.status(500).json({
                code: "ERR",
                message: 'Error getting order by id'
            });
            console.log(err);
        })
});

module.exports = router;