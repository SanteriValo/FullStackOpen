const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req) => req.method === "GET"
}));

let phones = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(phones)
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