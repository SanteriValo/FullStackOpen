import {useState} from "react";
import AddNewForm from "./components/AddNewForm.jsx";
import NameFilter from "./components/NameFilter.jsx";
import Numbers from "./components/Numbers.jsx";

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
            <NameFilter
                filterName={filterName}
                handleFilter={handleFilter}
            />
            <AddNewForm
                addNote = {addNote}
                newName = {newName}
                newNumber = {newNumber}
                handleAddName={handleAddName}
                handleAddNumber={handleAddNumber}

            />
            <Numbers
                filteredPersons ={filteredPersons}
            />
        </div>
    )
}

export default App