//
//  ViewController.swift
//  EventManager
//
//  Created by Vasu_SKH on 12/08/25.
//

import UIKit

protocol EventEditorDelegate  {
    func DataPassing(title: String?, date: String?, location: String?, count: Int?)
    
    func EventDeleted()
}

class EventSummaryViewController: UIViewController ,EventEditorDelegate {

    @IBOutlet weak var titleField: UITextField!
    @IBOutlet weak var dateField: UITextField!
    @IBOutlet weak var locationField: UITextField!
    @IBOutlet weak var countField: UITextField!
    
    
    func DataPassing(title: String?, date: String?, location: String?, count: Int?) {
        titleField.text = title
        dateField.text = date
        locationField.text = location
        countField.text = String(count!)
    }
    
    func EventDeleted() {
        titleField.text = ""
            dateField.text = ""
            locationField.text = ""
            countField.text = ""
        print("Event Deleted")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
//override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
//    guard let navigation = segue.destination as? UINavigationController ,let secondvc = navigation.topViewController as? EventEditorViewController else {
//            return
//        
//    }
//    secondvc.navigationItem.title = "Edit Summary"
//    
//    }

    @IBSegueAction func segue(_ coder: NSCoder) -> EventEditorViewController? {
        let titleData = titleField.text
        let dateData = dateField.text
        let locationData = locationField.text
        let countData = Int(countField.text!)
        
        return EventEditorViewController(coder: coder,titleData: titleData,dateData: dateData,locationData: locationData,countData: countData,EventSummaryVC : self)
    }
    
    
      
    @IBAction func unwindToEventSummaryViewController(_ unwindSegue: UIStoryboardSegue) {
        
    }
}

