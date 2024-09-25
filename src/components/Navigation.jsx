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
  const {
    getProfesional,
    setProfesional,
    setSesion
  } = useContext(Context)
  const [load, setLoad] = useState(false)

  const loadGoogleScript = async () => {
    const provider = new GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/script.external_request')
    setLoad(true)
    await signInWithPopup(auth, provider).then((result) => {
      // const authCredential = GoogleAuthProvider.credential(result)
      // const accessToken = authCredential.idToken._tokenResponse.oauthAccessToken
      const verified = result.user.emailVerified
      const emailDeFundacion = result.user.email
      // sessionStorage.setItem('accestoken', accessToken)
      if (!verified) {
        setLoad(false)
        return console.error('usuario, email o contraseña no es correcto')
      } else return emailDeFundacion
    }).then(async (usuario) => {
      const email = { email: usuario }
      return await axios.post(ENDPOINT.google, email)
    }).then(({ data }) => {
      const rol = data.rol
      const token = data.token
      sessionStorage.setItem('token', token)
      alert('Usuario identificado con éxito 😀')
      setProfesional({})
      setLoad(false)
      setSesion(true)
      if (rol === 3) {
        navigate('/admin')
        sessionStorage.setItem('sesionprm', rol)
      } else {
        navigate('/perfil')
        sessionStorage.setItem('sesionprm', 'usuario')
      }
    })
      .catch(({ response: { data } }) => {
        console.error(data.error)
        window.alert(`no se encontro el usuario o ${data.error} 🙁.`)
        setLoad(false)
        setSesion(false)
      })
  }

  const handleEntry = async () => await loadGoogleScript()

  const logout = () => {
    setProfesional(null)
    window.sessionStorage.removeItem('token')
    setSesion(false)
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
            : <Button onClick={() => handleEntry()}>📧Ingresar</Button>}
        </>
      )
    }

    return (
      <>
        <Link to='/total' className='btn m-1 btn-light'>Prórrogas</Link>
        {getProfesional.rol ? <Link className='btn m-1 btn-light' to='/analisis'>Análisis</Link> : <Link className='btn m-1 btn-light' to='/logros'>Logros</Link>}
        {getProfesional.rol ? <Link className='btn m-1 btn-light' to='/editar'>Editar Datos</Link> : <Link className='btn m-1 btn-light' to='/casos'>Casos</Link>}
        <Link className='btn m-1 btn-light' to={getProfesional.rol ? '/admin' : '/perfil'}>Informes</Link>
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
