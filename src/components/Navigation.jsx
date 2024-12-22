import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Context from '../contexts/context.js'
import { Button, Container, Navbar, Spinner, Form } from 'react-bootstrap'
import { signInWithEmailAndPassword } from 'firebase/auth'
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

  const loadGoogle = async (email, password) => {
    
    await signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result)
        const email = result.user.email
        if (!email.endsWith('@gmail.com')) {
          setLoad(false)
          throw new Error('Solo se aceptan cuentas de Gmail.')
        }
        return email
      })
      .then(async (email) => {
        const emailData = { email }
        return await axios.post(ENDPOINT.google, emailData)
      })
      .then((data) => {
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
      .catch((error) => {
        window.alert(`No se encontró el usuario o ${error.message || 'ocurrió un error'} 🙁.`)
        setLoad(false)
        setSesion(false)
      })
  }

  const handleEntry = () => setLoad(true)

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
            ? <>
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
              <Form>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Correo autorizado</Form.Label>
                  <Form.Control type='email' placeholder='tú email 📧' />
                  <Form.Text className='text-muted'>
                    no estoy registrado, quiero hacerme una cuenta
                  </Form.Text>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type='password' placeholder='Password' />
                </Form.Group>
                <Button variant='primary' type='submit'>
                  Ingresar
                </Button>
              </Form>
              </>

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
