import {useState} from "react";
import Person from "./components/Person";

const App = () => {
    const [persons, setPersons] = useState([
        {name: 'Arto Hellas', number: '040-123456', id: 1},
        {name: 'Ada Lovelace', number: '39-44-5323523', id: 2},
        {name: 'Dan Abramov', number: '12-43-234345', id: 3},
        {name: 'Mary Poppendieck', number: '39-23-6423122', id: 4}
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterName, setFilterName] = useState('')

    const addNote = (event) => {
        event.preventDefault()

        const nameAlreadyInTheList = persons.some(person => person.name === newName);

        if (nameAlreadyInTheList) {
            alert(`${newName} is already added to phonebook`)
        } else {
            setPersons(persons.concat({name: newName, number: newNumber, id: persons.length + 1}))
            setNewName('')
            setNewNumber('')
        }
    }

    const handleAddName = (event) => {
        setNewName(event.target.value)
    }

    const handleAddNumber = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilter = (event) => {
        setFilterName(event.target.value)
    }

    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

    return (
        <div>
            <h2>Phonebook</h2>
            <div>
                filter shown with <input
                value={filterName}
                onChange={handleFilter}
            />
            </div>
            <h2>add a new</h2>
            <form onSubmit={addNote}>
                <div>
                    name: <input
                    value={newName}
                    onChange={handleAddName}
                />
                </div>
                <div>
                    number: <input
                    value={newNumber}
                    onChange={handleAddNumber}
                />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            {filteredPersons.map(person => (
                <Person key={person.name} person={person}/>
            ))}
        </div>
    )
}

export default App