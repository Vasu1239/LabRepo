//
//  ViewController.swift
//  ApplePie
//
//  Created by VASU on 20/07/25.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var correctWordLabel: UILabel!
    @IBOutlet weak var scoreLabel: UILabel!
    
    
    @IBOutlet var lettersButton: [UIButton]!
    
    @IBOutlet weak var treeImageView: UIImageView!
    
    var listOfWords = ["apple","banana","cherry","grapes","pineapple"]
    let incorrectMovesAllowed = 7
    var totalWins = 0{
        didSet{
            newRound()
        }
    }
    var totalLosses = 0{
        didSet{
            newRound()
        }
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        newRound()
        // Do any additional setup after loading the view.
    }
    var currentGame: Game!
    
    func newRound(){
        if !listOfWords.isEmpty{
            
        let newWord = listOfWords.removeFirst()
        currentGame = Game(word: newWord , incorrectMovesRemaining: incorrectMovesAllowed, guessedLetters: [])
            enableLetterButtons(true)
        updateUI()
            
        }else{
            enableLetterButtons(false)
        }
    }
    func enableLetterButtons(_ enable: Bool){
        for letterButton in lettersButton{
            letterButton.isEnabled = enable
        }
    }
    func updateUI() {
        var letters = [String]()
        for letter in currentGame.formattedWord {
            letters.append(String(letter))
        }
        let wordWithSpacing = letters.joined(separator: " ")
        correctWordLabel.text = wordWithSpacing
        
        scoreLabel.text = "Wins: \(totalWins), Losses: \(totalLosses)"
        treeImageView.image = UIImage(named: "Tree \(currentGame.incorrectMovesRemaining)")
    }
    
    
    @IBAction func lettersButtonTapped(_ sender: UIButton ){
        sender.isEnabled = false
        let letterString = sender.configuration!.title!
        let letter = Character(letterString.lowercased())
        currentGame.playerGuessed(letter: letter)
        updateGamestate()
        updateUI()
    }
    func updateGamestate(){
        if currentGame.incorrectMovesRemaining == 0 {
            totalLosses += 1
            
        }else if currentGame.word == currentGame.formattedWord{
            totalWins += 1
        }
        else{
            updateUI()
        }
    }
    

}
