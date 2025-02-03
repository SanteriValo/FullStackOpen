import {useState, useEffect} from "react";
import axios from "axios";
import AddNewForm from "./components/AddNewForm.jsx";
import NameFilter from "./components/NameFilter.jsx";
import Numbers from "./components/Numbers.jsx";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterName, setFilterName] = useState('')

    useEffect(() => {
        axios.get('http://localhost:3001/persons')
            .then((response) => {
                setPersons(response.data);
            })
    }, []);

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