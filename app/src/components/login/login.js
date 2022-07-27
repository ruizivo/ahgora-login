import { useState, React, useContext } from 'react'
import AhgoraService from '../../service/ahgoraService'
import AppContext from '../../service/appContext'
import './login.css'

function Login () {
  const myContext = useContext(AppContext)

  const [inputs, setInputs] = useState({})

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const loginSubmit = (event) => {
    event.preventDefault()
    const user = {
      company: inputs.company,
      username: inputs.username,
      password: inputs.password
    }
    login(user)
  }

  function login (user) {
    AhgoraService.login(user).then(
      (result) => {
        myContext.setPageSelected('home')
      },
      (error) => {
        alert(error.message)
      }
    )
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <form method='post' onSubmit={loginSubmit}>
          <div className='box'>
            <h1>Login</h1>
            <input
              placeholder='empresa'
              type='text'
              name='company'
              className='input'
              value={inputs.company || ''}
              onChange={handleChange}
            />
            <input
              placeholder='usuario'
              type='text'
              name='username'
              className='input'
              value={inputs.username || ''}
              onChange={handleChange}
            />

            <input
              placeholder='senha'
              type='password'
              name='password'
              className='input'
              value={inputs.password || ''}
              onChange={handleChange}
            />

            <input type='submit' className='btn' />
          </div>
        </form>
      </header>
    </div>
  )
}

export default Login
