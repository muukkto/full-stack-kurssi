import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NOTIFY_VOTE":
        return {show: true, text: "anecdote '" + action.payload + "' voted"}
    case "CANNOT_ADD":
        return {show: true, text: "too short anecote, must have length 5 or more"}
    case "ZERO":
        return {show: false, text: ""}
    case "ADDED":
        return {show: true, text: "anecdote '" + action.payload + "' added"}
    default:
        return state
  }
}

const NotificationContext = createContext()

export const useNotifiaction = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[0]
}

export const useDispatch = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {show: false, text: ""})

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext