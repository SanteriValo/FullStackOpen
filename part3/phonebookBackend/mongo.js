const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (!password) {
    console.log("No password");
    process.exit(1);
}

const url =`mongodb+srv://fullstack:${password}@cluster0.vg0i1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)
    .then(() => console.log("Connected"))
    .catch(err => console.log('Connection error:', err));

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

if (name && number) {
    const phone = new Phone({name, number});
    phone.save().then(() => {
        console.log(`Added ${name} number ${number} to the phonebook`)
        mongoose.connection.close()
    });

} else {
    Phone.find({}).then(phones => {
        console.log('phonebook:');
        phones.forEach(phone => {
            console.log(`${phones.name} ${phones.number}`);
        });
        mongoose.connection.close();
    });
}
