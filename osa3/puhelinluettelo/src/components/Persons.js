import personService from '../services/persons'

const Persons = (props) => {
      console.log(props)
      const personsToShow = props.persons.filter(person => person.name.toLowerCase().includes(props.search.toLowerCase()))
      
      const removePer = id => {
        const person = props.persons.find(n => n.id === id)

          personService
          .removePers(id)
            .then(returned => {
              props.setPersons(props.persons.filter(person => person.id !== id))

              props.setErrorMessage(
                `${person.name} was removed from phonebook`
              )
              props.setErrorType("notification")
              setTimeout(() => {
                props.setErrorMessage(null)
              }, 5000)
          })
      }

      return (
        <div>
          {personsToShow.map(person => <p key={person.name}>{person.name} {person.number} <button onClick={() => removePer(person.id)}>Delete</button></p>)}
        </div>
      )  
}

export default Persons