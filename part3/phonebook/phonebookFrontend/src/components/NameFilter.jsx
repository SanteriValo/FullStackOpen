const NameFilter = (props) => {
    return (<div>
                filter shown with <input
                value={props.filterName}
                onChange={props.handleFilter}
            />
        </div>
    )
}

export default NameFilter



