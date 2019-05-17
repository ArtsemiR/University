const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');
const fs = require('fs');

const firestoreDB = firebaseAdmin.firestore();
const ordersRef = firestoreDB.collection('orders');
const ratingRef = firestoreDB.collection('rating');
const commentsRef = firestoreDB.collection('comments');

const multer  = require('multer');
const storage = multer.diskStorage({
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
const upload = multer({storage: storage});
const fbStorageBucket = firebaseAdmin.storage().bucket();

// api/v1/orders/uploadImage
router.post('/uploadImage',upload.single('image'),function(req, res, next) {
    console.log(req.file);
    if(!req.file) {
        res.status(500).json({
            code: 'ERR',
            message: 'Image load error'}
        );
        return next(err);
    }

    fbStorageBucket.upload(req.file.path, {
        destination: `orders/${req.file.filename}`,
        gzip: true,
        metadata: {
        cacheControl: 'public, max-age=31536000',
    }})
        .then(uploadResponse => {
            res.status(200).json({
                code: 'OK',
                message: 'Image has loaded',
                imageURL: uploadResponse[1].mediaLink
            });
            fs.unlink(req.file.path,function(err) {
                if(err && err.code === 'ENOENT') {
                    // file doens't exist
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    // other errors, e.g. maybe we don't have enough permission
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }})
        })
});

// api/v1/orders/add
// {
//     "userId": "0bcc2550-6f17-11e9-8167-11d0fdd90876"
//     "photoURL": "https://www.googleapis.com/download/storage/v1/b/university-26e9c.appspot.com/o/orders%2Fimage-1557578581465.png?generation=1557578603965038&alt=media"",
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
                createDiscusstion(orderId);
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

// api/v1/orders/uploadImage
router.post('/remove', function(req, res, next) {

    const id = req.query.orderId;
    ordersRef.doc(id).delete()
        .then(function () {
            removeInnerCollections(id);
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

//http://localhost:3000/api/v1/orders/user?userId=0bcc2550-6f17-11e9-8167-11d0fdd90876
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

function createDiscusstion(orderId  ) {
    commentsRef.doc(orderId).set({
        orderId: orderId,
        count: 0
    });
}

function removeInnerCollections(id) {
    ratingRef.doc(id).collection('likes').doc('desc').delete();
    ratingRef.doc(id).collection('dislikes').doc('desc').delete();
    ratingRef.doc(id).delete();

    deleteCollection(firestoreDB, commentsRef.doc(id).collection('messages'), 50);
    commentsRef.doc(id).delete();
}

function deleteCollection(db, collectionRef, batchSize) {
    var query = collectionRef.orderBy('userId').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size == 0) {
                return 0;
            }

            // Delete documents in a batch
            var batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
    })
        .catch(reject);
}

module.exports = router;