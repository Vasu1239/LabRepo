//
//  ActivityViewController.swift
//  Test-MealSuggestion
//
//  Created by Vasu_SKH on 07/08/25.
//

import UIKit

class ActivityViewController: UIViewController {
    @IBOutlet weak var activityButton1: UIButton!
    @IBOutlet weak var activityButton2: UIButton!
    @IBOutlet weak var activityButton3: UIButton!
    @IBOutlet weak var activityButton4: UIButton!
    
    @IBOutlet weak var activityLabel1: UILabel!
    @IBOutlet weak var activityLabel2: UILabel!
    @IBOutlet weak var activityLabel3: UILabel!
    @IBOutlet weak var activityLabel4: UILabel!
    
    
    
    var selectedMood: Mood?

    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let selectedMood = selectedMood {
            print(selectedMood)
        }
        updateUI()
        

        // Do any additional setup after loading the view.
    }
    

    
    func updateUI() {
        activityLabel1.text = meals[0].activity.name
        setupButton(button: activityButton1, textString: meals[0].activity.emoji)

        activityLabel2.text = meals[1].activity.name
        setupButton(button: activityButton2, textString: meals[1].activity.emoji)
        activityLabel3.text = meals[2].activity.name
        setupButton(button: activityButton3, textString: meals[2].activity.emoji)
        activityLabel4.text = meals[3].activity.name
        setupButton(button: activityButton4, textString: meals[3].activity.emoji)
        
    }
    func setupButton(button: UIButton, textString: String) {  button.setAttributedTitle(NSAttributedString(string: textString, attributes: [.font: UIFont.systemFont(ofSize: 100)]) , for: .normal)
    }
    
    
    @IBAction func ButtonTapped(_ sender: UIButton) {
        performSegue(withIdentifier: "ActivitySegue", sender: sender)
    }
    
    override func prepare (for segue: UIStoryboardSegue, sender: Any?) {
        segue.destination.navigationItem.title = "Suggested meal"
        guard let destinationVC = segue.destination as? ResultViewController else { return }
        
        guard let selectedButton = sender as? UIButton else { return }
        
        switch selectedButton {
            case activityButton1:
            destinationVC.selectedactivity = meals[0].activity
        case activityButton2:
            destinationVC.selectedactivity = meals[1].activity
        case activityButton3:
            destinationVC.selectedactivity = meals[2].activity
        case activityButton4:
            destinationVC.selectedactivity = meals[3].activity
        default:
            break
        }
        destinationVC.selectedMood = selectedMood
        
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
