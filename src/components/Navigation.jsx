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

  const loadGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
      .then((result) => {
        if (result.user.emailVerified) return result.user.email
        else alert('Su email no pudo ser verificado 🔒 Reintentalo')
      })
      .then(async (email) => {
        const emailData = { email }
        return await axios.post(ENDPOINT.google, emailData)
      })
      .then((data) => {
        const rol = data.data.rol
        const token = data.data.token
        alert('Usuario identificado con éxito 😀')
        setProfesional({})
        setLoad(false)
        setSesion(true)
        window.sessionStorage.setItem('token', token)
        if (rol === 3) {
          navigate('/admin')
          window.sessionStorage.setItem('sesionprm', rol)
        } else {
          navigate('/perfil')
          window.sessionStorage.setItem('sesionprm', 'usuario')
        }
      })
      .catch((error) => {
        window.alert(`No se encontró el usuario o ${error.message || 'ocurrió un error'} 🙁.`)
        setLoad(false)
        setSesion(false)
      })
  }

  const handleEntry = () => loadGoogle()

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
          ?
              <Button variant='primary' disabled>
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
        {getProfesional.rol ? <Link className='btn m-1 btn-light' to='/profesionales'>Editar Profesionales</Link> : <div>🍵</div>}
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
