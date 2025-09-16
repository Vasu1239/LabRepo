
import UIKit

protocol EmployeeDetailTableViewControllerDelegate: AnyObject {
    func employeeDetailTableViewController(_ controller: EmployeeDetailTableViewController, didSave employee: Employee)
}

class EmployeeDetailTableViewController: UITableViewController, UITextFieldDelegate ,EmployeeTypeTableViewControllerDelegate {
    
    

    @IBOutlet var nameTextField: UITextField!
    @IBOutlet var dobLabel: UILabel!
    @IBOutlet var employeeTypeLabel: UILabel!
    @IBOutlet var saveBarButtonItem: UIBarButtonItem!
    
    @IBOutlet weak var dobDatePicker: UIDatePicker!
    let birthdayCellIndexPath = IndexPath(row: 2, section: 0)
        let dateLabelCellIndexPath = IndexPath(row: 1, section: 0)
        
        var isEditingBirthday: Bool = false {
            didSet {
                dobDatePicker.isHidden = !isEditingBirthday
            }
        }
        
        weak var delegate: EmployeeDetailTableViewControllerDelegate?
        var employee: Employee?
        
        var employeeType: EmployeeType?
        
        let dateFormatter: DateFormatter = {
            let dateFormatter = DateFormatter()
            dateFormatter.dateStyle = .medium
            
            return dateFormatter
        }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        updateView()
        updateSaveButtonState()
    }
    
    @IBAction func datePickerAction(_ sender: UIDatePicker) {
        dobLabel.text = dateFormatter.string(from: dobDatePicker.date)
    }
    func updateView() {
        if let employee = employee {
                    navigationItem.title = employee.name
                    nameTextField.text = employee.name
                    
                    dobLabel.text = dateFormatter.string(from: employee.dateOfBirth)
                    dobLabel.textColor = .black
                    employeeTypeLabel.text = employee.employeeType.description
                    employeeTypeLabel.textColor = .black
                } else {
                    navigationItem.title = "New Employee"
                }
    }
    
    func updateSaveButtonState() {
        let shouldEnableSaveButton = nameTextField.text?.isEmpty == false && dobLabel.text?.isEmpty == false && employeeTypeLabel.text?.isEmpty == false
        saveBarButtonItem.isEnabled = shouldEnableSaveButton
    }
    
    @IBAction func saveButtonTapped(_ sender: Any) {
        guard let name = nameTextField.text else {
            return
        }
        
        let employee = Employee(name: name, dateOfBirth: Date(), employeeType: .exempt)
        delegate?.employeeDetailTableViewController(self, didSave: employee)
    }
    
    @IBAction func cancelButtonTapped(_ sender: Any) {
        employee = nil
    }

    @IBAction func nameTextFieldDidChange(_ sender: UITextField) {
        updateSaveButtonState()
    }
    
    
    func employeeTypeTableViewController(_ controller: EmployeeTypeTableViewController, didSelect employeeType: EmployeeType) {
            self.employeeType = employeeType
            employeeTypeLabel.text = employeeType.description
            employeeTypeLabel.textColor = .black
            updateSaveButtonState()
        }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "type" {
            let destination = segue.destination as! EmployeeTypeTableViewController
            destination.delegate = self
            destination.employeeType = employeeType
        }
    }
        
        override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
            tableView.deselectRow(at: indexPath, animated: true)
            
            if indexPath == dateLabelCellIndexPath {
                isEditingBirthday.toggle()
                dobLabel.textColor = .black
                dobLabel.text = dateFormatter.string(from: dobDatePicker.date)
            }
            tableView.beginUpdates()
            tableView.endUpdates()
        }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
            switch indexPath {
            case birthdayCellIndexPath where isEditingBirthday == false:
                return 0
            default:
                return UITableView.automaticDimension
            }
        }

}
