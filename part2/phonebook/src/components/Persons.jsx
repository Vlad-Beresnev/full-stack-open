const Persons = ({ personsToShow, toggleDeletion }) => {
    return (
        personsToShow.map(person => 
                <p key={person.id}>{person.name} {person.number} <button onClick={() => toggleDeletion(person.id)}>delete</button></p>   
                
        )
    )
}

export default Persons