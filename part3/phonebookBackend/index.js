const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const app = express();
const {connectToDatabase, Person} = require('./models/database');

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

connectToDatabase(password)
    .then(() => {
        if (name && number) {
            const person = new Person({ name, number });
            person.save().then(() => {
                console.log(`Added ${name} number ${number} to the phonebook`);
            });
        } else {
            Person.find({}).then(persons => {
                persons.forEach(person => {
                    console.log(`${person.name} ${person.number}`);
                });
            });
        }
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });


app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', async (request, response) => {
    const count = await Person.countDocuments();
    const now = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p><p>${now}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error));
})

app.post('/api/persons', async (request, response, next) => {
    try {
        const {name, number} = request.body

        if (!name || !number) {
            return response.status(400).json({
                error: 'The name or number is missing'
            })
        }

        const nameExists = await Person.findOne({name})
        if (nameExists) {
            return response.status(400).json({error: 'Name must be unique'})
        }

        const person = new Person({name, number});

        const savedPerson = await person.save();
        response.json(savedPerson);
    } catch (error) {
        next(error);
    }

})

const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`Server running at http://localhost:${PORT}`)