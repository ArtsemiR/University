const graphql = require('graphql');
const firebaseAdmin = require('firebase-admin');

const firestoreDB = firebaseAdmin.firestore();
const ordersRef = firestoreDB.collection('orders');
const ratingRef = firestoreDB.collection('rating');
const commentsRef = firestoreDB.collection('comments');

const RatingItemType = new graphql.GraphQLObjectType({
    name: 'RatingItem',
    fields: {
        count: {
            type: graphql.GraphQLInt
        },
        users: {
            type: new graphql.GraphQLList(graphql.GraphQLString)
        }
    }
});

const RatingType = new graphql.GraphQLObjectType({
    name: 'Rating',
    fields: {
        orderId: {
            type: graphql.GraphQLString
        },
        likes: {
            type: RatingItemType,
            resolve: async (source) => {
                return await ratingRef
                    .doc(source.orderId)
                    .collection('likes')
                    .doc('desc')
                    .get()
                    .then(snapshot => {
                        return snapshot.data()
                    })
            },
        },
        dislikes: {
            type: RatingItemType,
            resolve: async (source) => {
                return await ratingRef
                    .doc(source.orderId)
                    .collection('dislikes')
                    .doc('desc')
                    .get()
                    .then(snapshot => {
                        return snapshot.data()
                    })
            },
        }
    }
});

const OrderType = new graphql.GraphQLObjectType({
    name: 'Order',
    fields: {
        orderId: {
            type: graphql.GraphQLString
        },
        userId: {
            type: graphql.GraphQLString
        },
        photoURL: {
            type: graphql.GraphQLString
        },
        description: {
            type: graphql.GraphQLString
        },
        rating: {
            type: RatingType,
            resolve: async (source) => {
                return await ratingRef
                    .doc(source.orderId)
                    .get()
                    .then(snapshot => {
                        return snapshot.data()
                    });
            }
        }
    }
});

const OrderQueryType = new graphql.GraphQLObjectType({
    name: 'QueryType',
    fields: {
        orders: {
            type: new graphql.GraphQLList(OrderType),
            resolve: async () => {
                return await ordersRef
                    .get()
                    .then(snapshot => {
                        return snapshot.docs.map(function (order) {
                            return order.data();
                        })
                    });
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: OrderQueryType
});