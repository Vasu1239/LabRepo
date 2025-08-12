//
//  MoodSelectViewController.swift
//  Test-MealSuggestion
//
//  Created by Vasu_SKH on 06/08/25.
//

import UIKit

class MoodSelectViewController: UIViewController {

    
    @IBOutlet weak var moodButton1: UIButton!
    @IBOutlet weak var moodButton2: UIButton!
    @IBOutlet weak var moodButton3: UIButton!
    @IBOutlet weak var moodButton4: UIButton!
    
    @IBOutlet weak var moodLabel1: UILabel!
    @IBOutlet weak var moodLabel2: UILabel!
    @IBOutlet weak var moodLabel3: UILabel!
    @IBOutlet weak var moodLabel4: UILabel!
    
   
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.title = "Select your current mood"
        updateUI()
    }

    
    func updateUI(){
        moodLabel1.text = meals[0].mood.name
        setupButton(button: moodButton1, textString: meals[0].mood.emoji)
        moodLabel2.text = meals[4].mood.name
        setupButton(button: moodButton2, textString: meals[4].mood.emoji)
        moodLabel3.text = meals[8].mood.name
        setupButton(button: moodButton3, textString: meals[8].mood.emoji)
        moodLabel4.text = meals[12].mood.name
        setupButton(button: moodButton4, textString: meals[12].mood.emoji)
        
    }
    func setupButton(button: UIButton, textString: String) {  button.setAttributedTitle(NSAttributedString(string: textString, attributes: [.font: UIFont.systemFont(ofSize: 100)]) , for: .normal)
    }
    
    
    
    @IBAction func BuuttonTapped(_ sender: UIButton) {
        performSegue(withIdentifier: "MoodSegue", sender: sender)
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        segue.destination.navigationItem.title = "Select your current Activity"
        guard let activityVC = segue.destination as? ActivityViewController else {return}
        
        guard let selectedButton = sender as? UIButton else {return}
        
        switch selectedButton {
        case moodButton1:
            activityVC.selectedMood = meals[0].mood
        case moodButton2:
            activityVC.selectedMood = meals[4].mood
        case moodButton3:
            activityVC.selectedMood = meals[8].mood
        case moodButton4:
            activityVC.selectedMood = meals[12].mood
        default:
            break
        }
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
