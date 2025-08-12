/*:
## Exercise - Adopt Protocols: CustomStringConvertible, Equatable, and Comparable
 
 Create a `Human` class with two properties: `name` of type `String`, and `age` of type `Int`. You'll need to create a memberwise initializer for the class. Initialize two `Human` instances.
 */
class Human : CustomStringConvertible,Equatable,Comparable,Codable{
    let name :String
    let age :Int
    
    var description: String{
        return "\(name) has age : \(age)"
    }
    
    static func == (lhs: Human, rhs: Human) -> Bool {
        return lhs.name == rhs.name && lhs.age == rhs.age
    }
    
    static func < (lhs: Human, rhs: Human) -> Bool {
        return lhs.age < rhs.age
    }
    
    
    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }
    
}

var Person1 = Human(name: "Vasu", age: 19)
var Person2 = Human(name: "Bob", age: 25)

//:  Make the `Human` class adopt the `CustomStringConvertible` protocol. Print both of your previously initialized `Human` objects.
print(Person1)
print(Person2)

//:  Make the `Human` class adopt the `Equatable` protocol. Two instances of `Human` should be considered equal if their names and ages are identical to one another. Print the result of a boolean expression evaluating whether or not your two previously initialized `Human` objects are equal to eachother (using `==`). Then print the result of a boolean expression evaluating whether or not your two previously initialized `Human` objects are not equal to eachother (using `!=`).

print(Person1 != Person2)
   
//:  Make the `Human` class adopt the `Comparable` protocol. Sorting should be based on age. Create another three instances of a `Human`, then create an array called `people` of type `[Human]` with all of the `Human` objects that you have initialized. Create a new array called `sortedPeople` of type `[Human]` that is the `people` array sorted by age.
var human1 = Human(name: "Alice", age: 30)
var human2 = Human(name: "Duke", age: 25)
var human3 = Human(name: "Charlie", age: 22)

var people : [Human] = [human1,human2,human3]
var sortedPeople : [Human] = people.sorted(by: <)

for person in sortedPeople{
    print(person)
}

//:  Make the `Human` class adopt the `Codable` protocol. Create a `JSONEncoder` and use it to encode as data one of the `Human` objects you have initialized. Then use that `Data` object to initialize a `String` representing the data that is stored, and print it to the console.


/*:
page 1 of 5  |  [Next: App Exercise - Printable Workouts](@next)
 */
