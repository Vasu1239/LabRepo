//
//  AddRegistrationTableViewController.swift
//  Hotel Codable
//
//  Created by Vasu_SKH on 27/08/25.
//

import UIKit

class AddRegistrationTableViewController: UITableViewController , SelectRoomTypeTableViewControllerDelegate {
    
    
    
    @IBOutlet weak var firstNameTextField: UITextField!
    @IBOutlet weak var lastNameTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    
    @IBOutlet weak var checkInDateLabel: UILabel!
    @IBOutlet weak var checkInDatePicker: UIDatePicker!
    @IBOutlet weak var checkOutDateLabel: UILabel!
    @IBOutlet weak var checkOutDatePicker: UIDatePicker!
    
    @IBOutlet weak var numberOfAdultsLabel: UILabel!
    @IBOutlet weak var numberOfAdultsStepper: UIStepper!
    @IBOutlet weak var numberOfChildrenLabel: UILabel!
    @IBOutlet weak var numberOfChildrenStepper: UIStepper!
    
    @IBOutlet weak var wifiSwitch: UISwitch!
    
    @IBOutlet weak var roomTypeLabel: UILabel!
    
    @IBOutlet weak var saveButton: UIBarButtonItem!
    var roomType : RoomType?
    let chargesSection = 4
    
    var registration: Registration? {
        guard let roomType = roomType else {
            return nil
        }

        let firstName = firstNameTextField.text ?? ""
        let lastName = lastNameTextField.text ?? ""
        let email = emailTextField.text ?? ""
        let checkInDate = checkInDatePicker.date
        let checkOutDate = checkOutDatePicker.date
        let numberOfAdults = Int(numberOfAdultsStepper.value)
        let numberOfChildren = Int(numberOfChildrenStepper.value)
        let hasWifi = wifiSwitch.isOn

        return Registration(firstName: firstName,
                            lastName: lastName,
                            emailAddress: email,
                            checkInDate: checkInDate,
                            checkOutDate: checkOutDate,
                            numberOfAdults: numberOfAdults,
                            numberOfChildren: numberOfChildren,
                            wifi: hasWifi,
                            roomType: roomType)
    }

    
    
    
    let checkInDatePickerCellIndexPath = IndexPath(row: 1, section: 1)
    let checkOutDatePickerCellIndexPath = IndexPath(row: 3, section: 1)
    
    let checkInDateLabelCellIndexPath = IndexPath(row: 0, section: 1)
    let checkOutDateLabelCellIndexPath = IndexPath(row: 2, section: 1)
    
    var isCheckInDatePickerVisible : Bool = false{
        didSet {
            checkInDatePicker.isHidden = !isCheckInDatePickerVisible
        }
    }
    var isCheckOutDatePickerVisible : Bool = false{
        didSet {
            checkOutDatePicker.isHidden = !isCheckOutDatePickerVisible
        }
    }
    
    var selectedRegistration: Registration?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let midnightToday = Calendar.current.startOfDay(for: Date())
        checkInDatePicker.minimumDate = midnightToday
        checkInDatePicker.date = midnightToday
        checkOutDatePicker.minimumDate =  Calendar.current.date(byAdding: .day, value: 1, to: checkInDatePicker.date)
        updateDateViews()
        updateNumberOfGuests()
        updateRoomType()
        updateTheButtonState()
        if let selectedRegistration = selectedRegistration {
            updateRegisteration(registration: selectedRegistration)
        }
        print(selectedRegistration?.roomType)
    }
    
    init?(coder: NSCoder, registration: Registration?) {
        self.selectedRegistration = registration
        
        super.init(coder:coder)
        
        
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func updateRegisteration(registration: Registration){
        firstNameTextField.text = registration.firstName
        lastNameTextField.text = registration.lastName
        emailTextField.text = registration.emailAddress
        checkInDatePicker.date = registration.checkInDate
        checkOutDatePicker.date = registration.checkOutDate
        numberOfAdultsStepper.value = Double(registration.numberOfAdults)
        numberOfChildrenStepper.value = Double(registration.numberOfChildren)
        wifiSwitch.isOn = registration.wifi
        roomType = registration.roomType
    }
    
    func selectRoomTypeTableViewController(_ contoller: SelectRoomTypeTableViewController, didSelect roomType: RoomType) {
        self.roomType = roomType
        updateRoomType()
        updateTheButtonState()
    }
    
    @IBAction func datePickerValueChanged(_ sender: UIDatePicker) {
        updateDateViews()
    }
    func updateDateViews() {
        checkInDateLabel.text = checkInDatePicker.date.formatted(date: .abbreviated, time: .omitted)
        checkOutDateLabel.text = checkOutDatePicker.date.formatted(date: .abbreviated, time: .omitted)
    }
    
    
    @IBAction func stepperValueChanged(_ sender: UIStepper) {
        updateNumberOfGuests()
    }
    func updateNumberOfGuests(){
        numberOfAdultsLabel.text = "\(Int(numberOfAdultsStepper.value))"
        numberOfChildrenLabel.text = "\(Int(numberOfChildrenStepper.value))"
    }
    
    
    
    @IBAction func wifiSwitchChanged(_ sender: UISwitch) {
    }
    
    
    
    @IBSegueAction func selectRoomType(_ coder: NSCoder) -> SelectRoomTypeTableViewController? {
        let selectRoomTypeController =  SelectRoomTypeTableViewController(coder: coder)
        selectRoomTypeController?.delegate = self
        selectRoomTypeController?.roomType = roomType
        return selectRoomTypeController
        
    }
    func updateRoomType(){
        guard let roomType = roomType else {return roomTypeLabel.text = "No Room Type Selected"}
            roomTypeLabel.text = roomType.name
    }
    
    

    
    
    
    @IBAction func doneBarButtonTapped(_ sender: UIBarButtonItem) {
        let firstName = firstNameTextField.text ?? ""
        let lastName = lastNameTextField.text ?? ""
        let email = emailTextField.text ?? ""
        
        let checkInDate = checkInDatePicker.date
        let checkOutDate = checkOutDatePicker.date
        
        let numberOfAdults = Int(numberOfAdultsStepper.value)
        let numberOfChildren = Int(numberOfChildrenStepper.value)
        let hasWifi = wifiSwitch.isOn
        
        let roomChoice = roomType?.name ?? "No Room Type Selected"
        
        print("DONE TAPPED")
        print("First Name: \(firstName)")
        print("Last Name: \(lastName)")
        print("Email: \(email)")
        print("Check-In Date: \(checkInDate)")
        print("Check-Out Date: \(checkOutDate)")
        print("Number of Adults: \(numberOfAdults)")
        print("Number of Children: \(numberOfChildren)")
        print("Has Wifi: \(hasWifi)")
        print("Room Choice: \(roomChoice)")
        
    }
    
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        switch indexPath {
        case checkInDatePickerCellIndexPath where isCheckInDatePickerVisible == false :
            return 0
            
        case checkOutDatePickerCellIndexPath where isCheckOutDatePickerVisible == false :
            return 0
            
        default:
            return UITableView.automaticDimension
            
        }
    }
    
    override func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        switch indexPath {
        case checkInDatePickerCellIndexPath :
            return 190
            
        case checkOutDatePickerCellIndexPath :
            return 190
            
        default:
            return UITableView.automaticDimension
            
        }
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        if indexPath == checkInDateLabelCellIndexPath && !isCheckOutDatePickerVisible {
            isCheckInDatePickerVisible.toggle()
        }
        else if indexPath == checkOutDateLabelCellIndexPath && !isCheckInDatePickerVisible {
            isCheckOutDatePickerVisible.toggle()
        }
        else if indexPath == checkInDateLabelCellIndexPath || indexPath == checkOutDateLabelCellIndexPath {
            isCheckInDatePickerVisible.toggle()
            isCheckOutDatePickerVisible.toggle()
        }
        else {
            return
        }
        
        tableView.beginUpdates()
        tableView.endUpdates()
    }
    
    @IBAction func textFieldUpdated(_ sender: Any) {
        
        updateTheButtonState()
    }
    
    
    func updateTheButtonState() {
        guard
            let firstName = firstNameTextField.text, !firstName.isEmpty,
            let lastName = lastNameTextField.text, !lastName.isEmpty,
            let email = emailTextField.text, !email.isEmpty,
            let roomTypeText = roomTypeLabel.text, !roomTypeText.isEmpty
        else {
            saveButton.isEnabled = false
            return
        }
        saveButton.isEnabled = true
    }

    
    
    @IBAction func cancelButtonTapped(_ sender: UIBarButtonItem) {
        dismiss(animated: true , completion: nil)
    }
    
    
//    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
//           let cell = super.tableView(tableView, cellForRowAt: indexPath)
//           
//           if indexPath.section == chargesSection {
//               let charges = updateCharges()
//               var content = cell.defaultContentConfiguration()
//               
//               switch indexPath.row {
//               case 0:
//                   content.text = "Number of Nights"
//                   content.secondaryText = "\(charges.nights)"
//               case 1:
//                   content.text = "Room Type"
//                   content.secondaryText = roomType?.name ?? "None"
//               case 2:
//                   content.text = "Wi-Fi"
//                   content.secondaryText = "$\(charges.wifiCost)"
//               case 3:
//                   content.text = "Total"
//                   content.secondaryText = "$\(charges.total)"
//               default: break
//               }
//               
//               cell.contentConfiguration = content
//           }
//           return cell
//       }
   }
    
    


