import {useState, useEffect} from "react";
import HandleForms from "./components/HandleForms.jsx";
import NameFilter from "./components/NameFilter.jsx";
import Numbers from "./components/Numbers.jsx";
import BackendCommunicator from "./components/BackendCommunicator.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterName, setFilterName] = useState('')
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        BackendCommunicator.getAllPersons()
            .then((response) => {
                setPersons(response.data);
            })
    }, []);

    const addPerson = (event) => {
        event.preventDefault()

        const nameAlreadyInTheList = persons.some(person => person.name === newName);

        if (nameAlreadyInTheList) {
            const confirmUpdate = window.confirm(`${newName} is already added to phonebook. Replace the old number with the new one?`);

            if (confirmUpdate) {
                const person = persons.find(person => person.name === newName);
                const updatedPerson = { ...person, number: newNumber };
                BackendCommunicator.updatePerson(person.id, updatedPerson)
                    .then((response) => {
                        setPersons(persons.map(p => p.id !== person.id ? p : response.data));
                        setNewName('');
                        setNewNumber('');
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
                            setNotificationMessage(`Information of '${newName}' was already removed from the server.`)
                            setIsError(true);
                            setTimeout(() => setNotificationMessage(null), 5000);
                        }
                    })
            }
        } else {
            const newPerson = { name: newName, number: newNumber };
            BackendCommunicator.addPerson(newPerson)
                .then((response) => {
                    setPersons(persons.concat(response.data));
                    setNewName('');
                    setNewNumber('');

                    setNotificationMessage(`Added ${newPerson.name}`);
                    setIsError(false);
                    setTimeout(() => setNotificationMessage(null), 5000)
                });
        }
    };

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
            <Notification message={notificationMessage} isError={isError}/>
            <NameFilter
                filterName={filterName}
                handleFilter={handleFilter}
            />
            <HandleForms
                addPerson={addPerson}
                newName={newName}
                newNumber={newNumber}
                handleAddName={handleAddName}
                handleAddNumber={handleAddNumber}
            />
            <Numbers
                filteredPersons={filteredPersons}
                setPersons={setPersons}
                persons={persons}
            />
        </div>
    )
}

export default App