import Person from "./Person.jsx";

const Numbers = (props) => {
    return (
        <div>
            <h2>Numbers</h2>
            {props.filteredPersons.map(person => (
                <Person key={person.name} person={person}/>
            ))}
        </div>
    )
}

export default Numbers