const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://vladberesnev:${password}@cluster0.dqln5up.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
} else if (process.argv.length === 3) {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note.name, note.number)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length < 5 && process.argv.length > 3) {
    console.log('give note content and importance as arguments')
    process.exit(1)
} else if (process.argv.length === 5) {
    const note = new Person ({
        name: name,
        number: number,
    })
    note.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)        
        mongoose.connection.close()

    })
}

