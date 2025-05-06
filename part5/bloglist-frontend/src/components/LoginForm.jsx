import { useState } from 'react'

const LoginForm = ( { handleLogin } ) => {
  const [username, setUsername] = useState( '' )
  const [password, setPassword] = useState( '' )

  const submit = ( event ) => {
    event.preventDefault()
    handleLogin( username, password )
    setUsername( '' )
    setPassword( '' )
  }

  return (
    <form onSubmit={submit} data-testid="login-form">
      <div>
          username{' '}
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          data-testid="username-input"
        />
      </div>
      <div>
          password{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          data-testid="password-input"
        />
      </div>
      <button type="submit" data-testid="login-button">
          login
      </button>
    </form>
  )
}

export default LoginForm
