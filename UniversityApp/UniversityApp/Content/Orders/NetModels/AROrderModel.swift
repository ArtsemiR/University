//
//  AROrderModel.swift
//  UniversityApp
//
//  Created by Artsemi Ryzhankou on 6/2/19.
//  Copyright © 2019 Artsemi Ryzhankou. All rights reserved.
//

import Foundation

class AROrderDataModel: Decodable {
    var data: AROrdersModel
}

class AROrdersModel: Decodable {
    var orders: [AROrderModel]
}

class AROrderModel: Decodable {
    var orderId: String
    var userId: String
    var photoURL: String
    var description: String
    var rating: AROrderRatingModel
    var comments: AROrderMessagesModel
}

class AROrderRatingModel: Decodable {
    var likes: AROrderRatingItemModel
    var dislikes: AROrderRatingItemModel
}

class AROrderRatingItemModel: Decodable {
    var count: Int
    var users: [String]
}

class AROrderMessagesModel: Decodable {
    var count: Int
    var messages: [AROrderMessageItemModel]
}

class AROrderMessageItemModel: Decodable {
    var commentId: String
    var userId: String
    var message: String
}
