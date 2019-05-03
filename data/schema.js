var graphql = require('graphql');
var data = require('./database');

var messageType = new graphql.GraphQLObjectType ({
    name:'Message',
    fields:{
        id:{
            type:graphql.GraphQLInt
        },
        text:{
            type:graphql.GraphQLString
        }
    }
});

var userType = new graphql.GraphQLObjectType ({
    name:'User',
    fields:{
        name:{
            type:graphql.GraphQLString
        },
        id:{
            type:graphql.GraphQLString
        },
        messages:{
            type:new graphql.GraphQLList(messageType),
            resolve:function (root, args) {
                return data.getMessages(root.id)
            }
        }
    }
});

var queryType = new graphql.GraphQLObjectType ({
    name:'Query',
    fields: {
        user: {
            type: userType,
            args: {
                id:{
                    type:graphql.GraphQLString
                }
            },
            resolve:function (root, args) {
                return data.users[args.id];
            }
        }
    }
});

var schema = new graphql.GraphQLSchema({
    query:queryType
});

module.exports = schema;