//
//  ARLatestOrdersViewController.swift
//  UniversityApp
//
//  Created by Artsemi Ryzhankou on 6/1/19.
//  Copyright © 2019 Artsemi Ryzhankou. All rights reserved.
//

import UIKit
import SnapKit

class ARLatestOrdersViewController: UIViewController {

    private lazy var scrollView: UIScrollView = UIScrollView()
    private lazy var ordersStackView: UIStackView = {
        let stackView: UIStackView = UIStackView()
        stackView.axis = .vertical
        stackView.spacing = 8
        return stackView
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = #colorLiteral(red: 0.921431005, green: 0.9214526415, blue: 0.9214410186, alpha: 1)
        self.ordersStackView.backgroundColor = #colorLiteral(red: 0.921431005, green: 0.9214526415, blue: 0.9214410186, alpha: 1)
        
        self.view.addSubview(self.scrollView)
        self.scrollView.addSubview(self.ordersStackView)
        self.scrollView.snp.makeConstraints { (m) in
            m.edges.equalToSuperview().inset(UIEdgeInsets(top: 8, left: 8, bottom: 0, right: 8))
        }

        self.ordersStackView.snp.makeConstraints { (m) in
            m.edges.equalToSuperview()
            m.width.equalToSuperview()
        }

        self.getLatestOrders()
    }

    func getLatestOrders() {
        ARNet.shared.userRequest(
            fullPath: ARNet.shared.baseUrl,
            action: "api/v1/ordersgraphql",
            model: nil,
            parameters: ["query" : "{ orders { orderId userId photoURL description rating { likes { count users } dislikes { count users } } comments { count messages { commentId userId message } } } }"]) { (model: AROrderDataModel) in
                model.data.orders.forEach({ [weak self] (order) in
                    let view = AROrderCell()
                    view.model = order
                    self?.ordersStackView.addArrangedSubview(view)
                })
        }
    }
}
