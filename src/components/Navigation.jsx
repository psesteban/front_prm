import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Context from '../contexts/context.js'
import { Button, Container, Navbar, Spinner } from 'react-bootstrap'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import axios from 'axios'
import { auth } from '../config/firebaseConfig.js'
import { ENDPOINT } from '../config/constans'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Navigation.css'
import Logo from '../assets/logo.svg' // Assuming logo is an SVG

const Navigation = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional } = useContext(Context)
  const [goouser, setGoouser] = useState(null)
  const [load, setLoad] = useState(false)

  const loadGoogleScript = async () => {
    const provider = new GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/script.external_request')
    provider.addScope('https://www.googleapis.com/auth/script.processes')

    try {
      setLoad(true)
      const result = await signInWithPopup(auth, provider)
      const authCredential = GoogleAuthProvider.credential(result)
      const accessToken = authCredential.idToken._tokenResponse.oauthAccessToken
      const verified = authCredential.idToken.user.emailVerified
      const emailDeFundacion = authCredential.idToken.user.email
      sessionStorage.setItem('accestoken', accessToken)
      if (!verified) {
        setLoad(false)
        return console.error('usuario, email o contraseña no es correcto')
      }
      setGoouser({ email: emailDeFundacion })
      handleEntry(goouser)
    } catch (error) {
      console.error('Error durante ingreso con gmail:', error)
      setLoad(false)
    }
  }
  const handleEntry = async (usuario) => await axios.post(ENDPOINT.google, usuario)
    .then(({ data }) => {
      const rol = data.rol
      const token = data.token
      sessionStorage.setItem('token', token)
      alert('Usuario identificado con éxito 😀')
      setProfesional({})
      setLoad(false)
      if (rol === 3) {
        navigate('/admin')
      } else {
        navigate('/perfil')
      }
    })
    .catch(({ response: { data } }) => {
      console.error(data.error)
      window.alert(`no se encontro el usuario ${data.error} 🙁.`)
      setLoad(false)
    })
  const logout = () => {
    setProfesional(null)
    window.sessionStorage.removeItem('token')
    navigate('/')
  }

  const isLogin = () => {
    if (!getProfesional) {
      return (
        <>
          {load
            ? <Button variant='primary' disabled>
              <Spinner
                as='span'
                animation='grow'
                size='sm'
                role='status'
                aria-hidden='true'
              />
              Entrando...🔐
              </Button>
            : <Button onClick={() => loadGoogleScript()}>📧Ingresar</Button>}
        </>
      )
    }

    return (
      <>
        <Link to='/total' className='btn m-1 btn-light'>Total</Link>
        <Link className='btn m-1 btn-light' to={getProfesional.rol ? '/admin' : '/perfil'}>Resumen</Link>
        <button onClick={logout} className='btn btn-danger'>Salir</button>
      </>
    )
  }

  return (
    <Navbar>
      <Container className='logo'>
        <Navbar.Brand href='#home'>
          <img
            alt='logo'
            src={Logo}
            width='40'
            height='40'
            className='d-inline-block align-top'
          />{' '}
        </Navbar.Brand>
        <Link className='navbar-brand' to='/' />
        <div className='opciones'>
          {isLogin()}
        </div>
      </Container>
    </Navbar>
  )
}

export default Navigation
