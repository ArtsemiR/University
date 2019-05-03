var users = {
    "1": {
        "id": "1",
        "name": "Dan",
        "messages": [1,2,3]
    },
    "2": {
        "id": "2",
        "name": "Matie",
        "messages": [3,2,1]
    },
    "3": {
        "id": "3",
        "name": "Jessie",
        "messages": [1,4,1]
    }
}

var messages = {
    1: {
        id: 23,
        text: "Message text 1"
    },
    2: {
        id: 23,
        text: "Message text 2"
    },
    3: {
        id: 23,
        text: "Message text 3"
    },
    4: {
        id: 23,
        text: "Message text 4"
    },
};

exports.getMessages = function (userId) {
    return users[userId].messages.map(function (mid) {
        return messages[mid];
    })
};

exports.users = users;