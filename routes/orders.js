const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');

const firestoreDB = firebaseAdmin.firestore();
const ordersRef = firestoreDB.collection('orders');

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

http://localhost:3000/api/v1/orders/uploadImage

router.post('/uploadImage',upload.single('image'),function(req, res, next) {
    console.log(req.file);
    if(!req.file) {
        res.status(500);
        return next(err);
    }
    res.json({ imageUrl: 'localhost:3000/images/' + req.file.filename });
});

// http://localhost:3000/api/v1/orders/add
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
    }).
    then(doc => {
        if (doc.empty) {
            res.status(200).json({
                message: 'Order not created'
            });
            return;
        }

        res.status(200).json({
            code: "OK"
        });
    })
        .catch( err => {
            res.status(500).json({
                message: 'Order create error'
            });
            console.log(err);
        })
});

router.post('/remove/:orderId', function(req, res, next) {
    const id = req.params.orderId;
    var queryRef = ordersRef.where('orderId', '==', id);
    queryRef.get()
        .then(doc => {
            if (doc.empty) {
                res.status(200).json({
                    message: 'Order does not exist'
                });
                return;
            }

            ordersRef.doc(id).delete()
                .then(doc => {
                    if (doc.empty) {
                        res.status(200).json({
                            message: 'Order not removed'
                        });
                        return;
                    }

                    res.status(200).json({
                        code: "OK"
                    })
                })
        })
        .catch( err => {
            res.status(500).json({
                message: 'Order remove error'
            });
            console.log(err);
        })
});

//http://localhost:3000/api/v1/orders/all
router.get('/all', function(req, res, next) {
    ordersRef.get()
        .then(doc => {
            if (doc.empty) {
                res.status(200).json({
                    message: 'No orders'
                });
                return;
            }

            res.status(200).json({
                code: "OK",
                orders: doc.docs.map(function (order) {
                    return order.data();
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting orders'
            });
            console.log(err);
        });
});

//http://localhost:3000/api/v1/orders/2fcccd10-6e54-11e9-8582-4150f32892d0
router.get('/:userId', function(req, res, next) {
    const id = req.params.userId;
    var queryRef = ordersRef.where('userId', '==', id);
    queryRef.get()
        .then(doc => {
            if (doc.empty) {
                res.status(200).json({
                    message: 'No orders with such user'
                });
                return;
            }

            res.status(200).json({
                code: "OK",
                orders: doc.docs.map(function (order) { return order.data() })
            });
        })
        .catch( err => {
            res.status(500).json({
                message: 'Error getting order by id'
            });
            console.log(err);
        })
});

// http://localhost:3000/api/v1/users/user/0e34ef60-6e50-11e9-a578-89b89011cd2f
router.get('/order/:orderId', function(req, res, next) {
    const id = req.params.orderId;
    var queryRef = ordersRef.where('orderId', '==', id);
    queryRef.get()
        .then(doc => {
            const order = getOrder(id, doc);
            if (order == null) {
                res.status(200).json({
                    message: 'No orders with such id'
                });
                return;
            }

            res.status(200).json({
                code: "OK",
                order: order
            });
        })
        .catch( err => {
            res.status(500).json({
                message: 'Error getting order by id'
            });
            console.log(err);
        })
});

function getOrder(id, doc) {
    const orders = doc.docs.map(function (order) { return order.data() });
    if (!orders.empty) {
        return orders[0]
    } else {
        return null
    }
}

module.exports = router;