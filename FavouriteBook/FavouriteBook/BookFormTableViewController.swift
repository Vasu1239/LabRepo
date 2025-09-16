//
//  BookFormTableViewController.swift
//  FavouriteBook
//
//  Created by Vasu_SKH on 25/08/25.
//

import UIKit

class BookFormTableViewController: UITableViewController {
    
    @IBOutlet weak var titleField: UITextField!
    @IBOutlet weak var authorField: UITextField!
    @IBOutlet weak var genreField: UITextField!
    @IBOutlet weak var lengthField: UITextField!
    
    var book : Book?
    
    
    init?(coder: NSCoder, book: Book?) {
        self.book = book
        super.init(coder: coder)
    }
    
    required init?(coder: NSCoder) {
        self.book = nil
        super.init(coder: coder)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        updateView()
    }
    
    func updateView() {
        guard let book = book else {return}
        
        titleField.text = book.title
        authorField.text = book.author
        genreField.text = book.genre
        lengthField.text = book.length
    }
    
    @IBAction func SaveButtonPressed(_ sender: UIButton) {
//        guard let title = titleField.text,
//            let author = authorField.text,
//            let genre = genreField.text,
//            let length = lengthField.text else {return}
        
//        book = Book(title: title, author: author, genre: genre, length: length)
        
        let book = Book(title: titleField.text ?? "", author: authorField.text ?? "", genre: genreField.text ?? "", length: lengthField.text ?? "")
        
        self.book = book
        performSegue(withIdentifier: "UnwindToBookTable", sender: self)
    }
}
  
