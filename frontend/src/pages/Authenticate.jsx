import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Login from '../components/Login'
import Register from '../components/Register'

const Authenticate = () => {
  const [searchParams] = useSearchParams()

  // If URL has ?type=register open Register, otherwise Login
  const [authType, setAuthType] = useState(
    searchParams.get('type') === 'register' ? 'register' : 'login'
  )

  return authType === 'login'
    ? <Login    setAuthType={setAuthType} />
    : <Register setAuthType={setAuthType} />
}

export default Authenticate