const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.message === 'The name or number is missing') {
    return response.status(400).json({ error: 'The name or number is missing' })
  } else if (error.message === 'Name must be unique') {
    return response.status(400).json({ error: 'Name must be unique' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = errorHandler