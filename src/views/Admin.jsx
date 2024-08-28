import Context from '../contexts/context.js'
import ModalAddNew from '../components/ModalAdmin.jsx'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, ListGroup, Button, Badge, Stack, Spinner, Dropdown, DropdownButton } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'
import './Profile.css'
import useHandle from '../hooks/useHandle.jsx'

const Admin = () => {
  const { getProfesional, isLoading, filterAtrasos, getPendientes, getAtrasos, atrasosFiltrados, pendientesFiltrados, totalCasos, litleCharge, duplas, setDuplas } = useContext(Context)
  const { handleAddNNa, handleClick, handleClickFormato, getProfesionalData } = useHandle()
  const [logro, setLogro] = useState(100)
  const [filter, setFilter] = useState(false)
  const [select, setSelect] = useState('')

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
          <Card className='editar'>
            <DropdownButton
              id='dropdown-item-button' title={litleCharge
                ? <Spinner
                    as='span'
                    animation='grow'
                    size='sm'
                    role='status'
                    aria-hidden='true'
                  />
                : '👩‍👧‍👦'}
            >
              <Dropdown.ItemText>Modificar Datos 👇</Dropdown.ItemText>
              <Dropdown.Item as='button' onClick={() => handleAddNNa(1)}>Agregar NNJ</Dropdown.Item>
              <Dropdown.Item as='button' onClick={() => handleAddNNa(3)}>Cambiar Adulto Responsable</Dropdown.Item>
            </DropdownButton>
            <Link className='btn m-1 btn-light' to='/analisis'>📝🤝</Link>

          </Card>
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
                    <Button variant='outline-info' onClick={() => handleClickFormato(pendiente.id, pendiente.nombre, 1)}>{pendiente.nombre}</Button> {pendiente.estado
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
                    <Button variant='outline-info' onClick={() => handleClickFormato(atrasado.id, atrasado.nombre, 1)}>{atrasado.nombre}</Button> {atrasado.estado
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
      <ModalAddNew />
    </Container>
  )
}

export default Admin
