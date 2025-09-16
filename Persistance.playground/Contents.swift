//import UIKit
//struct Note : Codable {
//    let title : String
//    let text : String
//    let timestamp : Date
//    
//}
//
//let newNote = Note(title: "Hello", text: "World", timestamp: Date())
//
//let propertyListEncoder = PropertyListEncoder()
//if let encodedData = try? propertyListEncoder.encode(newNote){
//    print(encodedData)
//    
//    let propertyListDecoder = PropertyListDecoder()
//    if let decodedNote = try? propertyListDecoder.decode(Note.self, from: encodedData){
//        print(decodedNote)
//    }
//}
//




import Foundation

struct Note: Codable {
    let title: String
    let text: String
    let timestamp: Date
}

let note1 = Note(title: "Note One", text: "This is a sample note.", timestamp: Date())
let note2 = Note(title: "Note Two", text: "This is another sample note.", timestamp: Date())
let note3 = Note(title: "Note Three", text: "This is yet another sample note.", timestamp: Date())

let notes = [note1, note2, note3]

// Save Notes to File
let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
let archiveURL = documentsDirectory
    .appendingPathComponent("notes_test")
    .appendingPathExtension("plist")

let propertyListEncoder = PropertyListEncoder()
if let encodedNotes = try? propertyListEncoder.encode(notes) {
    try? encodedNotes.write(to: archiveURL, options: .noFileProtection)
    print("✅ Notes saved to: \(archiveURL.path)")
}

//Load Notes from File
let propertyListDecoder = PropertyListDecoder()
if let retrievedNotesData = try? Data(contentsOf: archiveURL),
   let decodedNotes = try? propertyListDecoder.decode([Note].self, from: retrievedNotesData) {
    print("📖 Decoded Notes:")
    for note in decodedNotes {
        print("Title: \(note.title), Text: \(note.text), Date: \(note.timestamp)")
    }
}
