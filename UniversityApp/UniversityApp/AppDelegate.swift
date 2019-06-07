//
//  AppDelegate.swift
//  UniversityApp
//
//  Created by Artsemi Ryzhankou on 5/29/19.
//  Copyright © 2019 Artsemi Ryzhankou. All rights reserved.
//

import UIKit
import Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        return true
    }
}

