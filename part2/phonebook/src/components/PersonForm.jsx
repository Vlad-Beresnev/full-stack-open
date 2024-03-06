const PersonForm = ({ addPerson, newName, newNumber, handlePersonChange }) => {
    return (
        <form onSubmit={addPerson}>
            <div>
                name:<input id="name" value={newName} onChange={handlePersonChange} />
            </div>
            <div>
                number:<input id="number" value={newNumber} onChange={handlePersonChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm