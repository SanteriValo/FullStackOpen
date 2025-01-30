const AddNewForm = (props) => {
    return (<div>
            <h2>add a new</h2>
            <form onSubmit={props.addNote}>
                <div>
                    name: <input
                    value={props.newName}
                    onChange={props.handleAddName}
                />
                </div>
                <div>
                    number: <input
                    value={props.newNumber}
                    onChange={props.handleAddNumber}
                />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default AddNewForm



