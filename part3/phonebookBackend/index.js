const express = require('express');
const app = express();

app.use(express.json());

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
    }
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

const PORT = 3001
app.listen(PORT)
console.log(`Server running at http://localhost:${PORT}`)