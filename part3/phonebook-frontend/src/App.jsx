import { useState, useEffect } from 'react';
import Filter from './components/Filter.jsx';
import PersonForm from './components/PersonForm.jsx';
import Persons from './components/Persons.jsx';
import phonebookService from './services/phonebook.js'
import './index.css'

const App = () => {


  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('')
  const [filterNames, setFilterNames] = useState('')
  const [message, setMessage] = useState(null)
  const [style, setStyle] = useState('')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const toggleDeletion = id => {
    const person = persons.find(person => person.id === id)
    

    if (window.confirm(`Delete ${person.name} ?`)) {
      phonebookService  
      .deletePerson(id)
      .then(response => {
        console.log(response.data)
        setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
        setStyle('message')
        setMessage(`Deleted ${person.name}`)
        
      })
      .catch(error => {
        console.log(error)
        setStyle('error')
        setMessage(`Information of ${person.name} has already been removed from server`)	
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    }
  }
  
  const updatePerson = (id, changedPerson) => {
    console.log(changedPerson)
    phonebookService
      .update(id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person: returnedPerson))
      })
      .catch(error => {
        console.log(error)
        setStyle('error')
        setMessage(`Information of ${changedPerson.name} has already been removed from server`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personToUpdate = persons.find(person => person.name === newName)
    const changedPerson = { ...personToUpdate, number: newNumber }


    const personObject = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString()
    }
    
    if (persons.some(person => person.number === newNumber) && persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    if (persons.some(person => person.name === newName)) {
      if (personToUpdate && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))  {
        updatePerson(personToUpdate.id, changedPerson)
        setStyle('message')
        setMessage(`Changed Number (${newNumber} for ${newName})`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    } else {
      
      phonebookService  
        .create(personObject)
        .then(returnedPerson => {
          console.log(personObject)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        setStyle('message')
        setMessage(`Added ${newName}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
    }
  }

  const Notification = ({ message, style }) => {
    if (message === null) {
      return null
    }

    if (style === 'error') {
      return (
        <div className='error'>
          {message}
        </div>
      )
    } else {
      return (
        <div className='message'>
          {message}
        </div>
      )
    }

  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    if (event.target.id === 'name') {
      setNewName(event.target.value)
    }
    else if (event.target.id === 'number') {
      setNewNumber(event.target.value)
    } else if (event.target.id === 'filter') {
      setFilterNames(event.target.value)
    }
  }

  const personsToShow = filterNames
      ? persons.filter(person => person.name.toLowerCase().includes(filterNames.toLowerCase())) 
      : persons
  return (
    <div>
      <Notification message={message} style={style} />
      <h2>Phonebook</h2>
      <Filter filterNames={filterNames} handlePersonChange={handlePersonChange} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handlePersonChange={handlePersonChange} />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} toggleDeletion={toggleDeletion} />
    </div>
  );
}


export default App