import {useState} from "react";
import Person from "./components/Person";

const App = () => {
    const [persons, setPersons] = useState([
        {name: 'Arto Hellas', number: '040-1234567'}
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const addNote = (event) => {
        event.preventDefault()

        const nameAlreadyInTheList = persons.some(person => person.name === newName);

        if (nameAlreadyInTheList) {
            alert(`${newName} is already added to phonebook`)
        } else {
            setPersons(persons.concat({name: newName, number: newNumber}))
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

    return (
        <div>
            <h2>Phonebook</h2>
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
            {persons.map(person => (
                <Person key={person.name} person={person}/>
            ))}
        </div>
    )
}

export default App