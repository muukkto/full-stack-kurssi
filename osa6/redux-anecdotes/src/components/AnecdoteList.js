import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter)))
    const dispatch = useDispatch()

    const voteAnec = async (id) => {
      dispatch(vote(id))
      dispatch(setNotification(`you voted '${(anecdotes.filter(anecdote => anecdote.id == id)[0].content)}'`, 5))
    }
  
    anecdotes.sort((a, b) => b.votes - a.votes)

    return (
      <div>
        {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => voteAnec(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
      </div>
    )
}

export default AnecdoteList