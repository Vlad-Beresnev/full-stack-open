const Filter = ({filterNames, handlePersonChange}) => {
    return (
        <div>
            <p>filter shown with <input id='filter' value={filterNames} onChange={handlePersonChange}/></p>
        </div>
    )
}

export default Filter