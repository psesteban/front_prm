import axios from 'axios'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans.js'
import { Container, Card, ListGroup, Button, Badge, Stack, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'
import './Profile.css'

const Admin = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional, filterAtrasos, getPendientes, getAtrasos, atrasosFiltrados, pendientesFiltrados, setData, casos } = useContext(Context)
  const token = window.sessionStorage.getItem('token')
  const accesScript = window.sessionStorage.getItem('accestoken')
  const urlScript = 'https://script.googleusercontent.com/a/macros/fundaciondem.cl/echo?user_content_key=fjJEnL4ocgIBV2Nok0vZ-V0OrYbJGNUZATxEVEDVbqfS-N5EUJGfmAzntRu_HGqQHP86m0olRNv4JsKbDaAQd1_9p8ka0Ev4OJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMi80zadyHLKB8BUNxsF9uTx1DmfU2jIlLFc8vL5kKEi0diVVRNvSu1fqNSIG1RtzAq7ANmImlOXb2ob3eWUknuIL8g6WjjyYM0dSkUUczY1IxIXPMCaQP89DL6zkhAw5XgKH5FOXaJf2agQEneoX2wQ&lib=MhBx1Tl4j65lsWnDPs1lRTqTnL97XiEFy'

  const [isLoading, setIsLoading] = useState(false)
  const [logro, setLogro] = useState(100)
  const [duplas, setDuplas] = useState(['duplas'])
  const [filter, setFilter] = useState(false)
  const [select, setSelect] = useState('')
  const [show, setShow] = useState(false)
  const [selectId, setSelectId] = useState(null)

  // configuración del modal
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const randomId = () => Math.random().toString(3)

  const filtro = (profesional) => {
    atrasosFiltrados(profesional)
    pendientesFiltrados(profesional)
    setSelect(profesional)
    setFilter(true)
  }
  const quitarFiltro = () => {
    setFilter(false)
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
    try {
      const result = await axios.get(ENDPOINT.admin, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const resultado = result.data
      const { casos } = resultado
      await setProfesional(resultado)
      await setData(casos)
      window.sessionStorage.setItem('CASOS', JSON.stringify(resultado))
    } catch (error) {
      console.error(error)
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('CASOS')
      setProfesional(null)
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  const putData = async (id, nombre) => await axios.put(ENDPOINT.admin, { rol: 3, id, nombre }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const postData = async () => await axios.post(urlScript, { logro })
    .then((result) => console.log(result))
    .catch((error) => console.log(error))

  const okButton = () => {
    const foundNna = casos.find((nna) => nna.id === selectId)
    const number = parseInt(foundNna.informe) + 1
    const updateNna = { ...foundNna, informe: number }
    const updatedData = casos.map((nna) => {
      if (nna.id === selectId) {
        return updateNna
      } else {
        return nna
      }
    })
    setProfesional(updatedData)
    putData(selectId, foundNna.nombre).then(
      (result) => {
        console.log(result)
        notify(result.data)
        setSelectId(null)
        handleClose()
      }
    ).catch((error) => console.error(error)).finally(() => { getProfesionalData() })
  }
  const handleClick = async (id) => {
    setSelectId(id)
    handleShow()
  }

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
      const profesionales = getProfesional && Array.isArray(getProfesional.casos)
        ? [...new Set(casos.map(caso => caso.profesional))]
        : []
      setDuplas(profesionales)
      filterAtrasos()
      percentWork()
    }
  }, [isLoading])

  const percentWork = () => {
    if (filter) {
      const totalCasos = 25
      const totalAtrasos = getAtrasos.length
      const descuento = totalCasos - (totalAtrasos)
      const porcentaje = (descuento * 100 / totalCasos)
      setLogro(porcentaje)
    } else {
      filterAtrasos()
      const totalCasos = casos.length
      const totalAtrasos = getAtrasos.length
      const descuento = totalCasos - (totalAtrasos)
      const porcentaje = (descuento * 100 / totalCasos)
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
                    {pendiente.nombre} {pendiente.estado
                      ? <Button variant='success'>👍✔️</Button>
                      : <Button variant='outline-warning' onClick={() => handleClick(pendiente.id)}>{pendiente.fechaInformePendiente}</Button>}{' '}
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
                    {atrasado.nombre} {atrasado.estado
                      ? <Button variant='success'>👍✔️</Button>
                      : <Button variant='outline-danger' onClick={() => handleClick(atrasado.id)}>{atrasado.fechaInformePendiente}</Button>}{' '}
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
      <Button variant='outline-warning' onClick={() => postData()}>Probar</Button>{' '}
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
      </>
    </Container>
  )
}

export default Admin
