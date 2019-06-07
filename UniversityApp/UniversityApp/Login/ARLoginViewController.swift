//
//  ViewController.swift
//  UniversityApp
//
//  Created by Artsemi Ryzhankou on 5/29/19.
//  Copyright © 2019 Artsemi Ryzhankou. All rights reserved.
//

import UIKit
import FirebaseAuth

class ARLoginViewController: UIViewController {
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!

    @IBAction func signIn(_ sender: UIButton) {
        Auth.auth().signIn(
        withEmail: self.emailTextField.text ?? "",
        password: self.passwordTextField.text ?? "") { [weak self] user, error in
            guard let self = self else { return }
            let storyboard = UIStoryboard(name: "Main", bundle: nil)
            let controller = storyboard.instantiateViewController(withIdentifier: "MainTabBarController")
            self.present(controller, animated: true, completion: nil)
        }
    }
}

