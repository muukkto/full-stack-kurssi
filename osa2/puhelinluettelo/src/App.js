import { useState, useEffect } from 'react'
import Search from "./components/Search"
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}
 
const App = () => {
  const [persons, setPersons] = useState([])
  const [search, setNewSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState("error")

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={errorType} />

      <Search search={search} setNewSearch={setNewSearch}/>

      <h3>Add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} setErrorType={setErrorType}/>

      <h2>Numbers</h2>
      <Persons persons={persons} search={search} setPersons={setPersons} setErrorMessage={setErrorMessage} setErrorType={setErrorType}/>
    </div>
  )

}

export default App