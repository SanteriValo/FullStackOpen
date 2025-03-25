const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
app.use(cors());
app.use(express.json());
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req) => req.method === "GET"
}));

if (!password) {
    console.log("No password");
    process.exit(1);
}

const encodedPassword = encodeURIComponent(password);
const url = `mongodb+srv://fullstack:${encodedPassword}@cluster0.vg0i1.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(() => console.log("Connected"))
    .catch(err => console.log('Connection error:', err));

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject.id
        delete returnedObject._id
        delete returnedObject.__v;
    }
});

const Person = mongoose.model('Person', personSchema);

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const count = phones.length
    const now = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p><p>${now}</p>`)
})

const generateId = () => {
    const maxId = phones.length > 0
        ? Math.max(...phones.map(p => Number(p.id)))
        : 0
    return String(maxId + 1)
}

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phones.find((p) => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phones = phones.filter((person) => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }

    const nameExists = phones.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({error: 'Name must be unique'})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    phones = phones.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`Server running at http://localhost:${PORT}`)