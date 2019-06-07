//
//  ARNewsViewController.swift
//  UniversityApp
//
//  Created by Artsemi Ryzhankou on 6/1/19.
//  Copyright © 2019 Artsemi Ryzhankou. All rights reserved.
//

import UIKit
import WebKit
import SnapKit

class ARNewsViewController: UIViewController {

    lazy var webView: WKWebView = {
        let webView: WKWebView = WKWebView()
        webView.allowsBackForwardNavigationGestures = true
        return webView
    }()

    override func viewDidLoad() {
        super.viewDidLoad()

        self.view.addSubview(webView)
        webView.snp.makeConstraints { (m) in
            m.edges.equalToSuperview()
        }

        if let url = URL(string: "http://www.bsut.by") {
            let request = URLRequest(url: url)
            self.webView.load(request)
        }
    }
}
