import axios from 'axios'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans.js'
import { Container, Card, ListGroup, Button, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional, filterAtrasos, getPendientes, getAtrasos } = useContext(Context)
  const token = window.sessionStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)
  const [nombre, setNombre] = useState({ nombre: 'profesional', rol: 'profesional' })
  const [logrados, setLogrados] = useState(0)
  const [logro, setLogro] = useState(100)
  const [plan, setPlan] = useState(false)
  const [win, setWin] = useState(false)
  const [show, setShow] = useState(false)
  const [selectId, setSelectId] = useState(null)
  const [selectNna, setSelectNna] = useState(null)

  // configuración del modal
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // mensaje felicidades al clickear termino de informe
  const notify = (idNna) => toast.success(`felicidades ${nombre.nombre} terminaste tu parte del informe de ${idNna} 💝`, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light'
  })

  const getProfesionalData = async () => {
    setIsLoading(true)
    try {
      const result = await axios.get(ENDPOINT.user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const resultado = result.data
      await setProfesional(resultado)
      return 'data cargada'
    } catch (error) {
      console.error(error)
      window.sessionStorage.removeItem('token')
      setProfesional(null)
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  const putData = async (id) => await axios.put(ENDPOINT.user, { rol: nombre.rol, id }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const okButton = () => {
    notify(selectNna)
    putData(selectId)
    getProfesionalData()
  }

  const actualiza = () => {
    filterAtrasos()
    const countNnaTrue = getProfesional.casos.reduce((count, nna) => {
      return nna.estado === true ? count + 1 : count
    }, 0)
    setLogrados(countNnaTrue)
  }

  useEffect(() => {
    percentWork()
    if (logro < 50) setPlan(true)
    else setPlan(false)
    if (logro > 90) {
      setWin(true)
    } else setWin(false)
  }, [logrados])

  const handleClick = async (id, nombre) => {
    setSelectId(id)
    setSelectNna(nombre)
    handleShow()
  }

  useEffect(() => {
    // Función para verificar si un objeto está vacío
    const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object

    // Verificar si getProfesional es null, undefined o un objeto vacío
    if (!getProfesional || typeof getProfesional === 'undefined' || isEmptyObject(getProfesional)) {
      getProfesionalData().then((result) => {
        const { profesional } = getProfesional
        setNombre({ nombre: profesional.nombre, rol: profesional.idRol })
        console.log(result)
      })
    }
  }, [])

  useEffect(() => {
    if (getProfesional && !isLoading) {
      actualiza()
    }
  }, [isLoading])

  const percentWork = () => {
    const totalAtrasos = getAtrasos.length
    const totalPendientes = getPendientes.length
    const descuento = 25 - (totalAtrasos) - (totalPendientes * 0.5) + logrados
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
              Hola <span className='fw-bold'>{nombre.nombre}</span>
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
                    {pendiente.nombre} - {pendiente.estado
                      ? <Button variant='success'>👍✔️</Button>
                      : <Button variant='outline-warning' onClick={() => handleClick(pendiente.id, pendiente.nombre)}>{pendiente.fechaInformePendiente}</Button>}{' '}
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
                    {atrasado.nombre} - {atrasado.estado
                      ? <Button variant='success'>👍✔️</Button>
                      : <Button variant='outline-danger' onClick={() => handleClick(atrasado.id, atrasado.nombre)}>{atrasado.fechaInformePendiente}⌛🔲</Button>}{' '}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </>
      )}
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Envio de Informe</Modal.Title>
          </Modal.Header>
          <Modal.Body>Es seguro que terminaste tu parte del informe de {selectNna}?</Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Aún no lo termino 🫢
            </Button>
            <Button variant='primary' onClick={okButton}>
              Terminado👍
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </Container>
  )
}

export default Profile
