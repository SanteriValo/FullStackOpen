import Person from "./Person.jsx";
import BackendCommunicator from "./BackendCommunicator.jsx";

const ListOfPersons = (props) => {
    const handleRemove = (id, name) => {
        const confirmRemove = window.confirm(`Delete ${name}?`)

        if (confirmRemove) {
            BackendCommunicator.remove(id)
                .then(() => {
                    props.setPersons(prevPersons => prevPersons.filter(person => person.id !== id));
                })
        }
    }
    return (
        <div>
            <h2>Numbers</h2>
            {props.filteredPersons.map((person) => (
                <div key={person.id}>
                    <Person person={person}/>
                    <div>
                        <button onClick={() => {
                            handleRemove(person.id, person.name)
                                }
                        }>Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListOfPersons