import axios from 'axios'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans.js'
import { Container, Card, ListGroup, Button, Modal, Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional, filterAtrasos, getPendientes, getAtrasos, setDataNna, generaWord } = useContext(Context)
  const token = window.sessionStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)
  const [nombre, setNombre] = useState({ nombre: 'profesional', rol: 'profesional', dupla: 'colega' })
  const [logrados, setLogrados] = useState(0)
  const [logro, setLogro] = useState(100)
  const [plan, setPlan] = useState(false)
  const [win, setWin] = useState(false)
  const [show, setShow] = useState(false)
  const [selectId, setSelectId] = useState(null)
  const [selectNna, setSelectNna] = useState(null)
  const [showformato, setShowFormato] = useState(false)
  const [isLoadData, setIsLoadData] = useState(false)

  // configuración del modal
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleCloseFormato = () => {
    setDataNna(null)
    setSelectId(null)
    setSelectNna(null)
    setShowFormato(false)
  }
  const handleShowFormato = () => setShowFormato(true)

  const chosenOne = (id, nombre) => {
    setSelectId(id)
    setSelectNna(nombre)
  }
  const getDataForI = async (id) => {
    const params = { id }
    await axios.get(ENDPOINT.data, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setIsLoadData(false)
        console.log(result.data)
        setDataNna(result.data)
      })
      .catch((error) => {
        setIsLoadData(false)
        console.log(error)
      })
  }
  const handleClickFormato = async (id, nombre) => {
    try {
      chosenOne(id, nombre)
      setIsLoadData(true)
    } catch (error) {
      console.error(error)
    } finally {
      getDataForI(id)
      handleShowFormato()
    }
  }
  const handleClickDescarga = async (tipo) => await generaWord(tipo, nombre.rol, nombre.nombre, nombre.dupla)

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
    chosenOne(id, nombre)
    handleShow()
  }

  useEffect(() => {
    // Función para verificar si un objeto está vacío
    const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object

    // Verificar si getProfesional es null, undefined o un objeto vacío
    if (!getProfesional || typeof getProfesional === 'undefined' || isEmptyObject(getProfesional)) {
      getProfesionalData().then((result) => {
        const { profesional } = getProfesional
        setNombre({ nombre: profesional.nombre, rol: profesional.idRol, dupla: profesional.dupla })
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
                    <Button variant='outline-info' onClick={() => handleClickFormato(pendiente.id, pendiente.nombre)}>{pendiente.nombre}</Button> - {pendiente.estado
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
                    <Button variant='outline-info' onClick={() => handleClickFormato(atrasado.id, atrasado.nombre)}>{atrasado.nombre}</Button> - {atrasado.estado
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
        <Modal show={showformato} onHide={handleCloseFormato}>
          <Modal.Header closeButton>
            <Modal.Title>Formato de Documento de {selectNna}</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Que formato deseas?</Modal.Body>
          <Modal.Footer>
            {!isLoadData
              ? <><Button variant='outline-primary' onClick={() => handleClickDescarga(1)}> El PII del Diagnóstico</Button>{' '}
                <Button variant='outline-success' onClick={() => handleClickDescarga(2)}> Formato de PII Tratamiento</Button>
                <Dropdown.Divider />
                <Button variant='info' onClick={() => handleClickDescarga(3)}> Formato de IPD</Button>{' '}
                <Button variant='success' onClick={() => handleClickDescarga(4)}> Formato de IA</Button>
                <Dropdown.Divider />
                <Button variant='danger' onClick={() => handleClickDescarga(5)}> Formato de prórroga</Button>
                </>
              : <Button variant='primary' disabled>
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
                <span className='visually-hidden'>Loading...</span>
                </Button>}
            <Dropdown.Divider />
            <Button variant='secondary' onClick={() => handleCloseFormato()}>
              Ninguno
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </Container>
  )
}

export default Profile
