import axios from 'axios'
import Context from '../contexts/context.js'
import useHandle from '../hooks/useHandle.jsx'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans.js'
import { Container, Card, ListGroup, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional, filterAtrasos, getPendientes, getAtrasos, setNombreProfesional, nombreProfesional } = useContext(Context)
  const { handleClickFormato } = useHandle()
  const token = window.sessionStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)
  const [logro, setLogro] = useState(100)
  const [plan, setPlan] = useState(false)
  const [win, setWin] = useState(false)

  const getProfesionalData = async () => {
    setIsLoading(true)
    try {
      const result = await axios.get(ENDPOINT.user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const resultado = result.data
      await setProfesional(resultado)
      const { profesional } = resultado
      return profesional
    } catch (error) {
      console.error(error)
      window.sessionStorage.removeItem('token')
      setProfesional(null)
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    percentWork()
    if (logro < 50) setPlan(true)
    else setPlan(false)
    if (logro > 90) {
      setWin(true)
    } else setWin(false)
  }, [filterAtrasos])

  useEffect(() => {
    // Función para verificar si un objeto está vacío
    const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object

    // Verificar si getProfesional es null, undefined o un objeto vacío
    if (!getProfesional || typeof getProfesional === 'undefined' || isEmptyObject(getProfesional)) {
      getProfesionalData().then((result) => {
        if (result) {
          setNombreProfesional({ nombre: result.nombre, rol: result.idRol, dupla: result.dupla })
        }
      })
    }
  }, [])

  useEffect(() => {
    if (getProfesional && !isLoading) {
      filterAtrasos()
    }
  }, [isLoading])

  const percentWork = () => {
    const totalAtrasos = getAtrasos.length
    const descuento = 25 - (totalAtrasos * 1.5)
    const porcentaje = (descuento * 100 / 25)
    setLogro(porcentaje)
  }
  return (
    <Container className='resumen'>
      {isLoading && (
        <h1>
          Cargando datos del profesional... <p>Dame unos segundos ⌛</p>
        </h1>
      )}
      {!isLoading && !getProfesional && (
        <h1>
          Un poco más ⌛
        </h1>
      )}
      {!isLoading && getProfesional && (
        <>
          <Card className='credencial'>
            <h1>
              Hola <span className='fw-bold'>{nombreProfesional.nombre}</span>
            </h1>
            <Progress
              percent={logro} status={plan ? 'error' : 'active'}
              theme={{
                active: {
                  symbol: win ? '🏄‍' : '⌛💻',
                  trailColor: 'pink',
                  color: win ? 'green' : 'yellow'
                },
                error: {
                  symbol: '🆘',
                  trailColor: 'pink',
                  color: 'red'
                }
              }}
            />
          </Card>
          <Card className='pendientes'>
            <Card.Body>
              <Card.Title>Pendientes</Card.Title>
              <ListGroup variant='flush'>
                {getPendientes.map((pendiente) => (
                  <ListGroup.Item key={pendiente.id}>
                    <Button variant='outline-info' onClick={() => handleClickFormato(pendiente.id, pendiente.nombre, 2)}>{pendiente.nombre}</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card className='atrasados'>
            <Card.Body>
              <Card.Title>Atrasados</Card.Title>
              <ListGroup variant='flush'>
                {getAtrasos.map((atrasado) => (
                  <ListGroup.Item key={atrasado.id}>
                    <Button variant='outline-info' onClick={() => handleClickFormato(atrasado.id, atrasado.nombre, 2)}>{atrasado.nombre}</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  )
}

export default Profile
