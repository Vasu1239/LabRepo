//
//  ViewController.swift
//  Spot Seat
//
//  Created by Vasu_SKH on 17/07/25.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet var myButton: [UIButton]!
    override func viewDidLoad() {
        super.viewDidLoad()
        for eachButton in myButton {
            eachButton.layer.cornerRadius = 10
        }
        
        
        
        // Do any additional setup after loading the view.
    }


}

