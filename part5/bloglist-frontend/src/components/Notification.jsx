const Notification = ({ message }) => {
  if (message === null) return null

  const baseStyle = {
    color: 'darkgreen',
    background: 'lightgrey',
    fontSize: 20,
    padding: 10,
    marginBottom: 10,
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: 2,
  }

  const style = {
    ...baseStyle,
    color: message.type === 'success' ? 'green' : 'red',
    borderColor: message.type === 'success' ? 'green' : 'red',
  }

  return (
    <div
      className={message.type}
      data-testid={message.type === 'error' ? 'error-message' : 'notification'}
    >
      {message.text}
    </div>
  )
}

export default Notification
