//
//  ViewController.swift
//  Two Buttons
//
//  Created by Vasu_SKH on 16/07/25.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var setField: UITextField!
    @IBOutlet weak var displayField: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func setText(_ sender: UIButton) {
        let input = setField.text
        displayField.text = input
        
    }
    
    @IBAction func clearText(_ sender: UIButton) {
        displayField
            .text = " "
    }
}

