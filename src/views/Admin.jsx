import axios from 'axios'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans.js'
import { Container, Card, ListGroup, Button, Badge, Stack, Modal, Spinner, Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'
import './Profile.css'

const Admin = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional, filterAtrasos, getPendientes, getAtrasos, atrasosFiltrados, pendientesFiltrados, totalCasos, atrasoTotal, pendienteTotal, generaWord, setDataNna } = useContext(Context)
  const token = window.sessionStorage.getItem('token')

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadData, setIsLoadData] = useState(false)
  const [logro, setLogro] = useState(100)
  const [duplas, setDuplas] = useState(['duplas'])
  const [filter, setFilter] = useState(false)
  const [select, setSelect] = useState('')
  const [show, setShow] = useState(false)
  const [showformato, setShowFormato] = useState(false)
  const [selectId, setSelectId] = useState(null)
  const [selectNna, setSelectNna] = useState(null)

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

  const randomId = () => Math.random().toString(3)

  // filtros de vista para cada dupla
  const filtro = (profesional) => {
    atrasosFiltrados(profesional)
    pendientesFiltrados(profesional)
    setSelect(profesional)
    setFilter(true)
  }
  const quitarFiltro = () => {
    setFilter(false)
    filterAtrasos()
  }

  // mensaje felicidades al clickear termino de informe
  const notify = (idNna) => toast.success(`felicidades ${getProfesional.nombre} informe de ${idNna} 💝revisado y enviado`, {
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
    await axios.get(ENDPOINT.admin, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((result) => {
      setProfesional(result.data)
      setIsLoading(false)
    }).catch((error) => {
      console.error(error)
      window.sessionStorage.removeItem('token')
      setProfesional(null)
      navigate('/')
    }
    )
  }

  const putData = async (id) => await axios.put(ENDPOINT.admin, { rol: 3, id }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const chosenOne = (id, nombre) => {
    setSelectId(id)
    setSelectNna(nombre)
  }
  const getDataForI = async (id) => {
    const params = { id }
    await axios.get(ENDPOINT.data, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setIsLoadData(false)
        setDataNna(result.data)
      })
      .catch((error) => {
        setIsLoadData(false)
        console.log(error)
      })
  }

  const okButton = async () => {
    await putData(selectId).then((result) => {
      if (result.data === true) {
        notify(selectNna)
        setSelectId(null)
        setSelectNna(null)
        getProfesionalData()
      }
    })
    handleClose()
  }
  const handleClick = async (id, nombre) => {
    chosenOne(id, nombre)
    handleShow()
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
  const handleClickDescarga = async (tipo) => await generaWord(tipo, 3, 'tratante', 'ts')

  useEffect(() => {
    // Función para verificar si un objeto está vacío
    const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object

    // Verificar si getProfesional es null, undefined o un objeto vacío
    if (!getProfesional || typeof getProfesional === 'undefined' || isEmptyObject(getProfesional)) {
      getProfesionalData()
    }
  }, [])

  useEffect(() => {
    if (getProfesional && !isLoading) {
      quitarFiltro()
      const casos = getProfesional.casos
      const profesionales = getProfesional && Array.isArray(casos)
        ? [...new Set(casos.map(caso => caso.profesional))]
        : []
      setDuplas(profesionales)
    }
  }, [isLoading])

  const percentWork = async () => {
    if (filter) {
      const totalAtrasos = getAtrasos.length
      const totalPendientes = getPendientes.length
      const terminados = 25 - (totalAtrasos) - (totalPendientes * 0.5)
      const porcentaje = (terminados * 100 / 25)
      setLogro(porcentaje)
    } else {
      const total = totalCasos
      const atrasados = getAtrasos.length
      const pendientes = getPendientes.length
      const terminados = total - atrasados - (pendientes * 0.5)
      const porcentaje = (terminados * 100 / totalCasos)
      setLogro(porcentaje)
    }
  }

  useEffect(() => {
    percentWork()
  }, [filter])

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
              Hola <span className='fw-bold'>{getProfesional.nombre}</span>
            </h1>
            <Progress percent={logro} />
            {!filter
              ? <ListGroup variant='flush'>
                {duplas.map((dupla) => (
                  <ListGroup.Item key={randomId()}>
                    <Button variant='primary' onClick={() => filtro(dupla)}>{dupla}</Button>
                  </ListGroup.Item>))}
              </ListGroup>
              : <ListGroup variant='flush'>
                <ListGroup.Item className='filtro'>
                  <Button variant='success'> Dupla de: {select}</Button>
                  <Button variant='danger' onClick={() => quitarFiltro()}>❌</Button>
                </ListGroup.Item>
              </ListGroup>}
          </Card>
          <Card className='pendientes'>
            <Card.Body>
              <Card.Title>Pendientes</Card.Title>
              <ListGroup variant='flush'>
                {getPendientes.map((pendiente) => (
                  <ListGroup.Item key={pendiente.id}>
                    <Button variant='outline-info' onClick={() => handleClickFormato(pendiente.id, pendiente.nombre)}>{pendiente.nombre}</Button> {pendiente.estado
                      ? <Button variant='success'>👍✔️</Button>
                      : <Button variant='outline-warning' onClick={() => handleClick(pendiente.id, pendiente.nombre)}>{pendiente.fechaInformePendiente}</Button>}{' '}
                    <Stack direction='horizontal' gap={2}>
                      <h6> I. psicológico {pendiente.ps
                        ? <Badge bg='success'>✔️</Badge>
                        : <Badge bg='warning' text='dark'>pendiente</Badge>}
                      </h6>
                      <h6> I. Social {pendiente.ts
                        ? <Badge bg='success'>✔️</Badge>
                        : <Badge bg='warning' text='dark'>pendiente</Badge>}
                      </h6>
                    </Stack>
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
                    <Button variant='outline-info' onClick={() => handleClickFormato(atrasado.id, atrasado.nombre)}>{atrasado.nombre}</Button> {atrasado.estado
                      ? <Button variant='success'>👍✔️</Button>
                      : <Button variant='outline-danger' onClick={() => handleClick(atrasado.id, atrasado.nombre)}>{atrasado.fechaInformePendiente}</Button>}{' '}
                    <Stack direction='horizontal' gap={2}>
                      <h6> I. psicológico {atrasado.ps
                        ? <Badge bg='success'>✔️</Badge>
                        : <Badge bg='danger'>atrasado</Badge>}
                      </h6>
                      <h6> I. Social {atrasado.ts
                        ? <Badge bg='success'>✔️</Badge>
                        : <Badge bg='danger'>atrasado</Badge>}
                      </h6>
                    </Stack>
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
          <Modal.Body>Es seguro que el informe está enviado?</Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Aún no
            </Button>
            <Button variant='primary' onClick={okButton}>
              Enviado👍
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

export default Admin
