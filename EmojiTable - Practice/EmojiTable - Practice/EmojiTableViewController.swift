//
//  EmojiTableViewController.swift
//  EmojiTable - Practice
//
//  Created by Vasu_SKH on 25/08/25.
//

import UIKit

class EmojiTableViewController: UITableViewController {
    
    @IBSegueAction func Add(_ coder: NSCoder, sender: Any?) -> AddEditTableViewController? {
        guard let indexPath = sender as? IndexPath else {
            return AddEditTableViewController(coder:coder,emoji: nil)
         }
        return AddEditTableViewController(coder:coder,emoji: emojis[indexPath.row])
    }
    

    override func viewDidLoad() {
        super.viewDidLoad()
        

    }
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return emojis.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as!EmojiTableViewCell

        cell.updateUI(emoji: emojis[indexPath.row])
        
        cell.showsReorderControl = true
        

        return cell
    }
    

    
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    

    
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            emojis.remove(at: indexPath.row)
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
            tableView.insertRows(at: [indexPath], with: .fade)
        }
    }
    

    
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {
       let removedEmoji = emojis.remove(at: fromIndexPath.row)
        emojis.insert(removedEmoji, at: to.row)

    }
    
    override func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCell.EditingStyle {
        
        if indexPath.row % 2 == 0{
            return .delete
        }
        return .insert
        
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        performSegue(withIdentifier: "EditSegue", sender: indexPath)
    }
    
    
    @IBAction func unwindToTableView(segue: UIStoryboardSegue) {
        guard segue.identifier == "saveSegue" , let addEditTVC = segue.source as? AddEditTableViewController , let emoji = addEditTVC.emoji  else{
            return
        }
        guard let selectedIndexPath = tableView.indexPathForSelectedRow else{
            emojis.append(emoji)
            let indexPath = IndexPath(row: emojis.count-1, section: 0)
            tableView.insertRows(at: [indexPath], with: .fade)
            return
        }
        
        emojis[selectedIndexPath.row] = emoji
        tableView.reloadRows(at: [selectedIndexPath], with: .fade)
        
    }

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
