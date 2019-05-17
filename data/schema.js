var graphql = require('graphql');
// var data = require('./database');
//
// var messageType = new graphql.GraphQLObjectType ({
//     name:'Message',
//     fields:{
//         id:{
//             type:graphql.GraphQLInt
//         },
//         text:{
//             type:graphql.GraphQLString
//         }
//     }
// });
//
// var userType = new graphql.GraphQLObjectType ({
//     name:'User',
//     fields:{
//         name:{
//             type:graphql.GraphQLString
//         },
//         id:{
//             type:graphql.GraphQLString
//         }
//             // ,
//         // messages:{
//         //     type:new graphql.GraphQLList(messageType),
//         //     resolve:function (root, args) {
//         //         return data.getMessages(root.id)
//         //     }
//         // }
//     }
// });
//
// var queryType = new graphql.GraphQLObjectType ({
//     name:'Query',
//     fields: {
//         user: {
//             type: userType,
//             args: {
//                 id:{
//                     type:graphql.GraphQLString
//                 }
//             },
//             resolve:function (root, args) {
//                 return data.users[args.id];
//             }
//         }
//     }
// });
//
// var schema = new graphql.GraphQLSchema({
//     query:queryType
// });
//
// module.exports = schema;

const orders = {
    "1": {
        "description": "Описание",
        "orderId": "5654e3e0-73f0-11e9-a733-4503a680788a",
        "photoURL": "https://www.googleapis.com/download/storage/v1/b/university-26e9c.appspot.com/o/orders%2Fimage-1557578581465.png?generation=1557578603965038&alt=media",
        "orderDate": {
            "_seconds": 1557581168,
            "_nanoseconds": 926000000
        },
        "userId": "0bcc2550-6f17-11e9-8167-11d0fdd90876"
    },
    "2": {
        "orderDate": {
            "_seconds": 1557581170,
            "_nanoseconds": 46000000
        },
        "userId": "0bcc2550-6f17-11e9-8167-11d0fdd90876",
        "description": "Описание",
        "orderId": "56ffc9e0-73f0-11e9-a733-4503a680788a",
        "photoURL": "https://www.googleapis.com/download/storage/v1/b/university-26e9c.appspot.com/o/orders%2Fimage-1557578581465.png?generation=1557578603965038&alt=media"
    },
    "3": {
        "userId": "0bcc2550-6f17-11e9-8167-11d0fdd90876",
        "description": "Описание",
        "orderId": "a2d39450-740e-11e9-a3b6-4582de353ee0",
        "photoURL": "https://www.googleapis.com/download/storage/v1/b/university-26e9c.appspot.com/o/orders%2Fimage-1557578581465.png?generation=1557578603965038&alt=media",
        "orderDate": {
            "_seconds": 1557594182,
            "_nanoseconds": 166000000
        }
    },
    "4": {
        "userId": "0bcc2550-6f17-11e9-8167-11d0fdd90876",
        "description": "Описание",
        "orderId": "a3ca7770-740e-11e9-a3b6-4582de353ee0",
        "photoURL": "https://www.googleapis.com/download/storage/v1/b/university-26e9c.appspot.com/o/orders%2Fimage-1557578581465.png?generation=1557578603965038&alt=media",
        "orderDate": {
            "_seconds": 1557594183,
            "_nanoseconds": 783000000
        }
    }
};

// const RatingType = new graphql.GraphQLObjectType({
//     name: 'Rating',
//     fields: {
//         count: {
//             type: graphql.GraphQLInt
//         },
//         likes: {
//             count: {
//                 type: graphql.GraphQLInt
//             }
//         },
//         dislikes: {
//             count: {
//                 type: graphql.GraphQLInt
//             }
//         }
//     }
// });

const orderType = new graphql.GraphQLObjectType({
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
        }
    }
});

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        order: {
            type: orderType,
            args: {
                id: {
                    type: graphql.GraphQLString
                }
            },
            resolve(root, args) {
                return orders[args.id];
            }
        }
    }
});

var schema = new graphql.GraphQLSchema({
    query: queryType
});


module.exports = schema;