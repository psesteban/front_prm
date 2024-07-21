import axios from 'axios'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans.js'
import { Container, Card, ListGroup, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Swal from 'sweetalert2'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'
import Badge from 'react-bootstrap/Badge'
import Stack from 'react-bootstrap/Stack'
import './Profile.css'

const Admin = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional, filterAtrasos, getPendientes, getAtrasos, atrasosFiltrados, pendientesFiltrados, setData, casos } = useContext(Context)
  const token = window.sessionStorage.getItem('token')
  const [contadordeVacio, setContadordeVacio] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [logro, setLogro] = useState(100)
  const [duplas, setDuplas] = useState(['duplas'])
  const [filter, setFilter] = useState(false)
  const [select, setSelect] = useState('')

  const randomId = () => Math.random().toString(3)

  const filtro = (profesional) => {
    atrasosFiltrados(profesional)
    pendientesFiltrados(profesional)
    setSelect(profesional)
    setFilter(true)
  }
  const quitarFiltro = () => {
    filterAtrasos()
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

  const putData = async (rol, id) => await axios.put(ENDPOINT.admin, { rol, id }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const handleClick = async (rol, id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Está completa la revisión del informe?',
      text: 'El informe ya se envió?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, listo',
      cancelButtonText: 'No, aún no',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: 'Base de datos actualizada',
          text: 'Listo',
          icon: 'success'
        })
        const foundNna = casos.find((nna) => nna.id === id)
        const number = parseInt(foundNna.informe) + 1
        const updateNna = { ...foundNna, informe: number }
        const updatedData = casos.map((nna) => {
          if (nna.id === id) {
            return updateNna
          } else {
            return nna
          }
        })
        setProfesional(updatedData)
        notify(foundNna.nombre)
        putData(rol, id)
        navigate('/admin')
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: 'No hay problema',
          text: 'Avísame cuando lo tengas listo👍',
          icon: 'error'
        })
      }
    })
  }

  useEffect(() => {
    // Función para verificar si un objeto está vacío
    const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object

    // Verificar si getProfesional es null, undefined o un objeto vacío
    if (!getProfesional || typeof getProfesional === 'undefined' || isEmptyObject(getProfesional)) {
      getProfesionalData()
      setContadordeVacio(contadordeVacio + 1)
    }
  }, [])

  useEffect(() => {
    if (getProfesional && !isLoading) {
      const profesionales = getProfesional && Array.isArray(getProfesional.casos)
        ? [...new Set(casos.map(caso => caso.profesional))]
        : []
      setDuplas(profesionales)
      filterAtrasos()
    }
  }, [isLoading])

  useEffect(() => {
    if (getPendientes.length > 0 && !isLoading) {
      percentWork()
    }
    if (getAtrasos.length > 0 && !isLoading) {
      percentWork()
    }
  }, [getAtrasos, getPendientes])

  const percentWork = () => {
    if (filter) {
      const totalCasos = 25
      const totalAtrasos = getAtrasos.length
      const totalPendientes = getPendientes.length
      const descuento = totalCasos - (totalAtrasos) - (totalPendientes * 0.5)
      const porcentaje = (descuento * 100 / totalCasos)
      setLogro(porcentaje)
    } else {
      const totalCasos = casos.length
      const totalAtrasos = getAtrasos.length
      const totalPendientes = getPendientes.length
      const descuento = totalCasos - (totalAtrasos) - (totalPendientes * 0.5)
      const porcentaje = (descuento * 100 / totalCasos)
      setLogro(porcentaje)
    }
  }

  return (
    <Container className='resumen'>
      {isLoading && (
        <h1>
          Cargando datos del profesional... <p>Dame unos segundos ⌛ {contadordeVacio}</p>
        </h1>
      )}
      {!isLoading && !getProfesional && (
        <h1>
          Un poco más ⌛ <span className='fw-bold'>{contadordeVacio}</span>
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
                      : <Button variant='outline-warning' onClick={() => handleClick(3, pendiente.id)}>{pendiente.fechaInformePendiente}</Button>}{' '}
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
                      : <Button variant='outline-danger' onClick={() => handleClick(3, atrasado.id)}>{atrasado.fechaInformePendiente}</Button>}{' '}
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
    </Container>
  )
}

export default Admin
