import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      return state.map(anecdote =>
        anecdote.id !== action.payload.id ? anecdote : action.payload 
      )
    }
  }
})

export const { setAnecdotes, appendAnecdote, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = id => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const anecdoteToChange = anecdotes.find(n => n.id === id)
    const changedAnecdote = { 
      ...anecdoteToChange, 
      votes: anecdoteToChange.votes + 1 
    }
    const updatedAnecdote = await anecdoteService.update(id, changedAnecdote)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}


export default anecdoteSlice.reducer