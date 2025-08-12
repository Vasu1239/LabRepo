//
//  ResultViewController.swift
//  Test-MealSuggestion
//
//  Created by Vasu_SKH on 07/08/25.
//

import UIKit

class ResultViewController: UIViewController {
    
    
    @IBOutlet weak var welcomeLabel: UILabel!
    @IBOutlet weak var resultLabel: UILabel!
    
    
    var selectedMood : Mood?
    var selectedactivity : Activity?
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        welcomeLabel.text = "Based on Selections, Your Meal Suggestion is"
        
        if let mood = selectedMood, let activity = selectedactivity  {
        print(mood," ",activity)
        }
        
        updateUI();
        
        // Do any additional setup after loading the view.
    }
    
    func updateUI(){
        guard let mood = selectedMood, let activity = selectedactivity else {
                    return
                }
                
        guard let match = meals.first(where: {meal in meal.mood.name == mood.name && meal.activity.name == activity.name }) else {
                    return
                }
        resultLabel.text = "\(mood.emoji) \(mood.name) + \(activity.emoji) \(activity.name) → 🍽️ \(match.suggestedMeal)"
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
        
    
