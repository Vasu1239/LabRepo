//
//  EventEditorViewController.swift
//  EventManager
//
//  Created by Vasu_SKH on 12/08/25.
//

import UIKit



class EventEditorViewController: UIViewController {
    
    @IBOutlet weak var secondTitleField: UITextField!
    @IBOutlet weak var secondDateField: UITextField!
    @IBOutlet weak var secondLocationField: UITextField!
    @IBOutlet weak var secondCountField: UITextField!
    
    var delegate : EventEditorDelegate?
    
    var titleData: String?
    var dateData: String?
    var locationData: String?
    var countData: Int?
    
    init?(coder: NSCoder, titleData : String?, dateData : String?, locationData : String?, countData : Int?,EventSummaryVC : EventSummaryViewController) {
        self.titleData = titleData
        self.dateData = dateData
        self.locationData = locationData
        self.countData = countData
        self.delegate = EventSummaryVC
        super.init(coder: coder)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.title = "Event Editor"
        
        if let titleData,let dateData,let locationData,let countData {
            updateUI(titleData: titleData, dateData: dateData, locationData: locationData, countData: countData)
            
            // Do any additional setup after loading the view.
        }}
    
        
        func updateUI(titleData: String, dateData: String, locationData: String, countData: Int){
            
            
            secondTitleField.text = titleData
            secondDateField.text = dateData
            secondLocationField.text = locationData
            secondCountField.text = String(countData)
            
        }
    
    @IBAction func SaveButton(_ sender: Any) {
        delegate?.DataPassing(title: secondTitleField.text, date: secondDateField.text, location: secondLocationField.text, count:Int(secondCountField.text ?? "") )
        performSegue(withIdentifier: "unwindSegue", sender: nil)
        
    }
    
    @IBAction func DeleteButtonPressed(_ sender: Any) {
        delegate?.EventDeleted()
        
        performSegue(withIdentifier: "unwindSegue", sender: nil)
        
        
    }
    
    }
    

