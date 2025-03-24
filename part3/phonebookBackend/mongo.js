const mongoose = require('mongoose');

console.log('Script started...');
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (!password) {
    console.log("No password");
    process.exit(1);
}

const encodedPassword = encodeURIComponent(password);
const url = `mongodb+srv://fullstack:${encodedPassword}@cluster0.vg0i1.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

console.log('Connecting to MongoDB...');

mongoose.connect(url)
    .then(() => console.log("Connected"))
    .catch(err => console.log('Connection error:', err));

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);  // ✅ Теперь снова `Person`

if (name && number) {
    const person = new Person({ name, number });
    person.save().then(() => {
        console.log(`Added ${name} number ${number} to the phonebook`);
        mongoose.connection.close();
    });

} else {
    Person.find({}).then(persons => {
        console.log('phonebook:');
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
}
