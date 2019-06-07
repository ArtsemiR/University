//
//  ARNet.swift
//  UniversityApp
//
//  Created by Artsemi Ryzhankou on 6/2/19.
//  Copyright © 2019 Artsemi Ryzhankou. All rights reserved.
//

import Foundation
import Alamofire

class ARNet {
    static let shared = ARNet()

    var baseUrl: String {
        return "http://localhost:3000/"
    }

    var alamofireManager: SessionManager

    var userHeaders: [String: String] = ["Content-Type": "application/json"]

    private init() {
        self.alamofireManager = SessionManager()
    }

    func userRequest<T: Decodable>(
        fullPath: String,
        action: String,
        model: Encodable?,
        parameters: [String: String]? = nil,
        okHandler: @escaping (T) -> Void) {
        var url: String = ""

        var _parameters: [String: String] = [:]

        if let parametersTemp = parameters {
            for parameter in parametersTemp {
                _parameters[parameter.key] = parameter.value
            }
        }
        url = self.getUrlWithParams(fullPath: "\(fullPath)\(action)", params: _parameters)

        var modelParameters: [String: Any]?
        var method: HTTPMethod = .get

        if let model = model {
            modelParameters = try? model.asDictionary()
            method = .post
        }

        self.alamofireManager.request(
            url.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "",
            method: method,
            parameters: modelParameters,
            encoding: JSONEncoding.default,
            headers: self.userHeaders).responseJSON { (response) in
                let statusCode: Int = response.response?.statusCode ?? 0
                switch statusCode {
                case 200:
                    if let json = response.value as? [String: Any] {
                        print(json)
                        do {
                            let data = try JSONSerialization.data(withJSONObject: json, options: .prettyPrinted)
                            let decoder = JSONDecoder()
//                            decoder.keyDecodingStrategy = .convertFromSnakeCase
                            let res = try decoder.decode(T.self, from: data)
                            okHandler(res)
                        } catch let error {
                            print(error)
                        }
                    }
                case 403:
                    return
                case 404:
                    return
                case 500:
                    break
                default:
                    break
                }
        }
    }

    func getUrlWithParams(fullPath: String, params: [String: String]) -> String {
        var url: String = fullPath
        if params.count > 0 {
            url += "?"
            for param in params {
                if url[url.count - 1] != "?" &&
                    url[url.count - 1] != "&" {
                    url += "&"
                }
                url += "\(param.key)=\(param.value)"
            }
        }
        return url
    }
}

extension String {
    /// EZSE: Cut string from integerIndex to the end
    public subscript(integerIndex: Int) -> Character {
        let index = self.index(startIndex, offsetBy: integerIndex)
        return self[index]
    }

    /// EZSE: Cut string from range
    public subscript(integerRange: Range<Int>) -> String {
        let start = index(startIndex, offsetBy: integerRange.lowerBound)
        let end = index(startIndex, offsetBy: integerRange.upperBound)
        let range = start..<end
        return String(self[range])
    }
}


extension Data {
    var prettyPrintedJSONString: NSString? {
        guard let object = try? JSONSerialization.jsonObject(with: self, options: []),
            let data = try? JSONSerialization.data(withJSONObject: object, options: [.prettyPrinted]),
            let prettyPrintedString = NSString(data: data, encoding: String.Encoding.utf8.rawValue) else { return nil }

        return prettyPrintedString
    }
}

extension Encodable {
    func asDictionary() throws -> [String: Any] {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .customEncoder
        let data = try encoder.encode(self)
        guard let dictionary = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] else {
            throw NSError()
        }
        return dictionary
    }

    func toData() throws -> Data {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .customEncoder
        let data = try encoder.encode(self)
        return data
    }
}

extension JSONDecoder.DateDecodingStrategy {
    static let customDecoder = custom { decoder throws -> Date in
        let container = try decoder.singleValueContainer()
        let string = try container.decode(String.self)
        if let date = Formatter.baseFormat.date(from: string) ?? Formatter.reserveFormat.date(from: string) {
            return date
        }
        throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date: \(string)")
    }
}

extension JSONEncoder.DateEncodingStrategy {
    static let customEncoder = custom { date, encoder throws in
        var container = encoder.singleValueContainer()
        try container.encode(Formatter.baseFormat.string(from: date))
    }
}

extension Formatter {
    static let baseFormat: DateFormatter = {
        let formatter = DateFormatter()
        //        formatter.locale = Locale(identifier: GP.DateTime.baseLocale)
        //        formatter.timeZone = TimeZone(abbreviation: GP.DateTime.parseTimeZone)
        formatter.dateFormat = "YYYYMMddHHmmss"

        return formatter
    }()

    static let reserveFormat: DateFormatter = {
        let formatter = DateFormatter()
        //        formatter.locale = Locale(identifier: GP.DateTime.baseLocale)
        //        formatter.timeZone = TimeZone(abbreviation: GP.DateTime.parseTimeZone)
        formatter.dateFormat = "YYYYMMddHHmmss"

        return formatter
    }()
}
