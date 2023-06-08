import { useNotifiaction } from '../NotificationContext'

const Notification = () => {
  const notification = useNotifiaction()
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (!notification.show) return (null)

  return (
    <div style={style}>
      {notification.text}
    </div>
  )
}

export default Notification
