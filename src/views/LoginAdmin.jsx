import axios from 'axios'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans'
import Context from '../contexts/context.js'
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const LoginAdmin = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: '', password: '' })
  const [load, setLoad] = useState(false)

  const { setProfesional } = useContext(Context)

  const handleUser = (event) => setUser({ ...user, [event.target.name]: event.target.value })

  const handleForm = (event) => {
    event.preventDefault()

    if (!user.name.trim() || !user.password.trim()) {
      return alert('Nombre y contraseña son obligatorios.')
    }
    setLoad(true)
    axios.post(ENDPOINT.admin, user)
      .then(({ data }) => {
        sessionStorage.setItem('token', data.token)
        alert('Autorización exitosa 😀')
        setProfesional({})
        setLoad(false)
        navigate('/admin')
      })
      .catch(({ response: { data } }) => {
        console.error(data.error)
        window.alert(`${data.error} 🙁.`)
      })
  }

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleForm}>
            <h1 className='text-center'>Iniciar asesoria</h1>
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
              : <Button variant='primary' type='submit'>
                Entrar
                </Button>}
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginAdmin
