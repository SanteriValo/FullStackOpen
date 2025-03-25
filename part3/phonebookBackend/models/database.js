const mongoose = require('mongoose');

const connectToDatabase = (password) => {
    const encodedPassword = encodeURIComponent(password);
    const url = `mongodb+srv://fullstack:${encodedPassword}@cluster0.vg0i1.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

    mongoose.set('strictQuery', false)
    return mongoose.connect(url)
        .then(() => console.log("Connected"))
        .catch(err => console.log('Connection error:', err));
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject.__v;
    }
});

const Person = mongoose.model('Person', personSchema);

module.exports = {connectToDatabase, Person};