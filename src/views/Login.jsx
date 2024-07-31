import axios from 'axios'
import Context from '../contexts/context.js'
import { auth } from '../config/firebaseConfig.js'
import { ENDPOINT } from '../config/constans'

import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { jwtDecode } from 'jwt-decode'

import 'bootstrap/dist/css/bootstrap.min.css'

const Login = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: '', password: '' })
  const [goouser, setGoouser] = useState({ name: '' })
  const [load, setLoad] = useState(false)
  const { setProfesional } = useContext(Context)
  const handleUser = (event) => setUser({ ...user, [event.target.name]: event.target.value })

  const handleForm = (event) => {
    event.preventDefault()

    if (!user.name.trim() || !user.password.trim()) {
      return alert('Nombre y contraseña son obligatorios.')
    }
    setLoad(true)
    axios.post(ENDPOINT.user, user)
      .then(({ data }) => {
        sessionStorage.setItem('token', data.token)
        alert('Usuario identificado con éxito 😀.')
        setProfesional({})
        setLoad(false)
        navigate('/perfil')
      })
      .catch(({ response: { data } }) => {
        console.error(data.error)
        window.alert(`${data.error} 🙁.`)
      })
  }

  const loadGoogleScript = async () => {
    const provider = new GoogleAuthProvider()

    try {
      setLoad(true)
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.idToken
      const decoded = jwtDecode(token)
      const verified = decoded.email_verified
      if (!verified) {
        setLoad(false)
        return console.error('usuario, email o contraseña no es correcto')
      }
      const email = decoded.email
      const partes = email.split(/\.|@/)
      const nombreCompleto = partes.slice(0, 2).map(parte => parte.charAt(0).toUpperCase() + parte.slice(1)).join(' ')
      console.log(nombreCompleto)
      setGoouser({ name: nombreCompleto })
      axios.post(ENDPOINT.google, goouser)
        .then(({ data }) => {
          sessionStorage.setItem('token', data.token)
          alert('Usuario identificado con éxito 😀.')
          setProfesional({})
          setLoad(false)
          navigate('/perfil')
        })
        .catch(({ response: { data } }) => {
          console.error(data.error)
          window.alert(`no se encontro el usuario ${data.error} 🙁.`)
          setLoad(false)
        })
    } catch (error) {
      console.error('Error durante ingreso con gmail:', error)
      setLoad(false)
    }
  }

  return (
    <Container className='login'>
      <Row className='justify-content-center'>
        <Col>
          <Form onSubmit={handleForm}>
            <h1 className='text-center'>Iniciar Sesión</h1>
            <hr />
            <Form.Group controlId='formName'>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type='text'
                name='name'
                value={user.name}
                onChange={handleUser}
                placeholder='Tu nombre'
              />
            </Form.Group>
            <Form.Group controlId='formPassword'>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type='password'
                name='password'
                value={user.password}
                onChange={handleUser}
                placeholder='Contraseña'
              />
            </Form.Group>
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
              : <div>
                <Button onClick={() => loadGoogleScript()}>📧</Button>
                <Button variant='primary' type='submit'>
                  Entrar
                </Button>
                </div>}
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
