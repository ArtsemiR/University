//
//  ARRegisterViewController.swift
//  UniversityApp
//
//  Created by Artsemi Ryzhankou on 6/7/19.
//  Copyright © 2019 Artsemi Ryzhankou. All rights reserved.
//

import UIKit
import FirebaseAuth

class ARRegisterViewController: UIViewController {
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var passwordRepeatTextField: UITextField!
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var surnameTextField: UITextField!
    @IBOutlet weak var phoneNumberTextField: UITextField!

    @IBAction func register(_ sender: UIButton) {
        Auth.auth().createUser(
            withEmail: self.emailTextField.text ?? "",
            password: self.passwordTextField.text ?? "") { [weak self] (user, error) in
                guard let self = self else { return }
                let storyboard = UIStoryboard(name: "Main", bundle: nil)
                let controller = storyboard.instantiateViewController(withIdentifier: "MainTabBarController")
                self.present(controller, animated: true, completion: nil)
        }
    }
}
