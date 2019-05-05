const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');

const firestoreDB = firebaseAdmin.firestore();
const ordersRef = firestoreDB.collection('orders');

// http://localhost:3000/api/v1/orders/add
// {
//     "userId": "2fcccd10-6e54-11e9-8582-4150f32892d0",
//     "orderDate": "25.10.1996",
//     "photoURL": "www.google.com",
//     "description": "Описание"
// }
router.post('/add', function(req, res, next) {
    const uuidv1 = require('uuid/v1');
    const orderId = uuidv1();
    if (req.body.userId == null,
        req.body.orderDate == null,
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
        orderDate: req.body.orderDate,
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
            message: 'Order added',
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
                        message: 'Order removed'
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
                message: null,
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
                message: null,
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