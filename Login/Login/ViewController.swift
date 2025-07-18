//
//  ViewController.swift
//  Login
//
//  Created by Vasu_SKH on 18/07/25.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var usernameText: UITextField!
    @IBOutlet weak var forgotUsernameButton: UIButton!
    @IBOutlet weak var forgotPasswordButton: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
//    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
//        segue.destination.navigationItem.title = usernameText.text
//    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
            guard let sender = sender as? UIButton else { return }

            if sender == forgotPasswordButton {
                segue.destination.navigationItem.title = "Forgot Password"
            } else if sender == forgotUsernameButton {
                segue.destination.navigationItem.title = "Forgot Username"
            } else {
                segue.destination.navigationItem.title = usernameText.text
            }
        }
    
    @IBAction func forgotButtonPressed(_ sender: UIButton) {
        performSegue(withIdentifier: "mainPage", sender: sender)
        
    }
    
    @IBAction func forgotPasswordButtonPressed(_ sender: Any) {
        performSegue(withIdentifier: "mainPage", sender: sender)
    }
    
    
}

