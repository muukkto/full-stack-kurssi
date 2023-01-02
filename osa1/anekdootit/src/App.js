import { useState } from 'react'

const randint = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const points = { 0: 1, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } 

  const [selected, setSelected] = useState(0)
  const [pts_list, add] = useState(points)
  const [max_key, refr_max_key] = useState([0, 0])

  const Vote = (i) => {
    const copy = { ...pts_list }
    copy[i] += 1
    add(copy)

    if (max_key[1] < copy[i]) {
      refr_max_key([i, copy[i]])
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <button onClick={() => Vote(selected)}>vote</button>
      <button onClick={() => setSelected(randint(0, 6))}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[max_key[0]]}</p>
    </div>
  )
}

export default App