//
//  PrepareSecondViewController.swift
//  DataPassing
//
//  Created by Vasu_SKH on 08/08/25.
//

import UIKit

class PrepareSecondViewController: UIViewController {
    
    var navigationTitle: String?

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        if let navigationTitle = navigationTitle {
            navigationItem.title = navigationTitle
        }
    }
    
    @IBAction func unwindToFirst(segue: UIStoryboardSegue) {
        guard let sourceVC = segue.source as? PrepareFirstViewController else { return }
        navigationTitle = sourceVC.secondDataTextView.text
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        guard let destinationVC = segue.destination as? PrepareUnwindSecondVC else { return }
        destinationVC.dataFromFirstVC = firstDataTextView.text
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
