const NameFilter = (props) => {
    return (<div>
            <h2>Phonebook</h2>
            <div>
                filter shown with <input
                value={props.filterName}
                onChange={props.handleFilter}
            />
            </div>
        </div>
    )
}

export default NameFilter



