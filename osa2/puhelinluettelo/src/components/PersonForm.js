import { useState } from 'react'
import axios from 'axios'
import personService from '../services/persons'
import persons from '../services/persons'

const PersonForm = (props) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
  
    const addNumber = (event) => {
      event.preventDefault()
      const found = props.persons.find(person => person.name === newName);
      

      if (found == undefined) {
        const personObject = {
          name: newName,
          number: newNumber,
        }
        personService
          .create(personObject)
          .then(returned => {
            props.setPersons(props.persons.concat(returned))
            setNewName('')
            setNewNumber('')
            props.setErrorMessage(
              `Added ${newName} to phonebook`
            )
            props.setErrorType("notification")
            setTimeout(() => {
              props.setErrorMessage(null)
            }, 5000)
      })
      } else {
        const changedPerson = { ...found, number: newNumber }

        personService
          .update(found.id, changedPerson)
          .then(returnedPerson => {
            props.setPersons(props.persons.map(person => person.id !== found.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            props.setErrorMessage(
              `Changed ${newName}'s number to ${newNumber}`
            )
            props.setErrorType("notification")
            setTimeout(() => {
              props.setErrorMessage(null)
            }, 5000)
          })
          .catch(error => {
            props.setErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            props.setErrorType("error")
            setTimeout(() => {
              props.setErrorMessage(null)
            }, 5000)
          })
        }
  
    }
  
    const handleNameChange = (event) => {
      setNewName(event.target.value)
    }
  
    const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
    }
  
    return (
      <form onSubmit={addNumber}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm