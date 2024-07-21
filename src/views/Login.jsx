import axios from 'axios'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans'
import Context from '../contexts/context.js'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const Login = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: '', password: '' })
  const { setProfesional } = useContext(Context)

  const handleUser = (event) => setUser({ ...user, [event.target.name]: event.target.value })

  const handleForm = (event) => {
    event.preventDefault()

    if (!user.name.trim() || !user.password.trim()) {
      return alert('Nombre y contraseña son obligatorios.')
    }
    axios.post(ENDPOINT.user, user)
      .then(({ data }) => {
        sessionStorage.setItem('token', data.token)
        alert('Usuario identificado con éxito 😀.')
        setProfesional({})
        navigate('/perfil')
      })
      .catch(({ response: { data } }) => {
        console.error(data.error)
        window.alert(`${data.error} 🙁.`)
      })
  }

  return (
    <Container>
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
            <Button variant='primary' type='submit'>
              Ingresa
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
