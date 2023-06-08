import { createSlice } from '@reduxjs/toolkit'
import { updateAnecdote } from './anecdoteReducer'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: "",
    reducers: {
      updateNotification(state, action) {
        return action.payload
      },
      removeNotification(state, action) {
        return null
      }
    },
  })
  
export const { updateNotification, removeNotification } = notificationSlice.actions

export const setNotification = (content, time) => {
    return dispatch => {
      dispatch(updateNotification(content))
      setTimeout(() => {
        dispatch(removeNotification())
      }, time*1000)
    }
  }

export default notificationSlice.reducer