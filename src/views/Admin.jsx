import axios from 'axios'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans.js'
import { Container, Card, ListGroup, Button, Badge, Stack, Modal, Spinner, Dropdown, Form, InputGroup, Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import accounting from 'accounting'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'
import './Profile.css'

const Admin = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional, filterAtrasos, getPendientes, getAtrasos, atrasosFiltrados, pendientesFiltrados, totalCasos, generaWord, setDataNna } = useContext(Context)
  const token = window.sessionStorage.getItem('token')
  const { register, handleSubmit } = useForm()
  const [litleCharge, setLitleCharge] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadData, setIsLoadData] = useState(false)
  const [logro, setLogro] = useState(100)
  const [duplas, setDuplas] = useState(['duplas'])
  const [filter, setFilter] = useState(false)
  const [select, setSelect] = useState('')
  const [show, setShow] = useState(false)
  const [showformato, setShowFormato] = useState(false)
  const [showAdult, setShowAdult] = useState(false)
  const [showNna, setShowNna] = useState(false)
  const [showNewAd, setShowNewAd] = useState(false)
  const [selectId, setSelectId] = useState(null)
  const [selectNna, setSelectNna] = useState(null)
  const [modificar, setModificar] = useState(false)
  const [listas, setListas] = useState(null)
  const [addNna, setAddNna] = useState(true)
  // Menu de modificación
  const handleModificar = () => {
    if (modificar) setModificar(false)
    else setModificar(true)
  }
  const onSubmitAdulto = async (datos) => {
    const id = Math.floor(Math.random() * 900 + 2)
    const responsable = datos.nombre
    const nacimiento = datos.nacimiento
    const rutParteA = parseInt(datos.rut)
    const rutDigito = datos.rutDigito
    const run = accounting.formatNumber(rutParteA, 0, '.') + '-' + rutDigito
    const fono = datos.fono
    const labores = datos.labor
    const tsId = datos.ts
    const data = {
      id,
      run,
      responsable,
      nacimiento,
      fono,
      labores,
      tsId
    }
    await axios.put(ENDPOINT.adulto, { data }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => {
      notifyIngreso(responsable)
      if (addNna) {
        handleCloseAdult()
        handleAddNNa(2)
      } else {
        handleCloseAdult()
        handleAddNNa(4)
      }
    })
  }

  const handleAdult = () => {
    if (addNna) {
      handleCloseAdult()
      handleAddNNa(2)
    } else {
      handleCloseAdult()
      handleShowChange()
    }
  }
  const onSubmitNna = async (datos) => {
    const id = datos.id
    const nombre = datos.nombre
    const nacimiento = datos.nacimiento
    const rutParteA = parseInt(datos.rut)
    const rutDigito = datos.rutDigito
    const rut = accounting.formatNumber(rutParteA, 0, '.') + '-' + rutDigito
    const genero = datos.genero
    const nacion = datos.nacion
    const domicilio = datos.domicilio
    const comuna = datos.comuna
    const tratante = datos.tratante
    const causa = datos.causa
    const juzgado = datos.juzgado
    const ingreso = datos.ingreso
    const adulto = datos.adulto
    const motivo = datos.motivo
    const salud = datos.salud
    const educacion = datos.educacion
    const curso = datos.curso
    const parentesco = datos.curso
    const data = {
      id,
      rut,
      nombre,
      nacimiento,
      genero,
      nacion,
      domicilio,
      comuna,
      tratante,
      causa,
      juzgado,
      ingreso,
      adulto,
      parentesco,
      curso,
      motivo,
      salud,
      educacion
    }
    await axios.put(ENDPOINT.nna, { data }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => {
      notifyIngreso(nombre)
      handleCloseNna()
    })
  }

  const onSubmitChange = async ({ id, parentesco, responsable }) => await axios.put(ENDPOINT.lista, { id, parentesco, responsable }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((r) => handleCloseChange())

  // configuración del modal
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleCloseAdult = () => setShowAdult(false)
  const handleShowAdult = () => setShowAdult(true)
  const handleShowNna = () => setShowNna(true)
  const handleCloseNna = () => setShowNna(false)
  const handleShowChange = () => setShowNewAd(true)
  const handleCloseChange = () => setShowNewAd(false)
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
  const notifyIngreso = (nombre) => toast.success(` ${nombre} ha ingresado con éxito`, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark'
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
        console.error(error)
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

  const handleAddNNa = async (etapa) => {
    setLitleCharge(true)
    if (etapa === 1) {
      setAddNna(true)
      handleShowAdult()
    } else if (etapa === 2) handleShowNna()
    else if (etapa === 3) {
      setAddNna(false)
      handleShowAdult()
    } else if (etapa === 4) handleShowChange()

    await axios.get(ENDPOINT.lista, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        const array = result.data
        const gen = array.arrayGen.map((lista) => ({
          id: lista.id,
          nombre: lista.gen
        }))
        const nacion = array.arrayNacionalidad.map((lista) => ({
          id: lista.id,
          nombre: lista.nacion
        }))
        const curso = array.arrayCurso.map((lista) => ({
          id: lista.id,
          nombre: lista.curso
        }))
        const comuna = array.arrayComuna.map((lista) => ({
          id: lista.id,
          nombre: lista.comuna
        }))
        const parentesco = array.arrayParentesco.map((lista) => ({
          id: lista.id,
          nombre: lista.parentesco
        }))
        const juzgado = array.arrayJuzgado.map((lista) => ({
          id: lista.id,
          nombre: lista.juzgado
        }))
        const motivo = array.arrayMotivo.map((lista) => ({
          id: lista.id,
          nombre: lista.motivo
        }))
        const educacional = array.arrayEducacional.map((lista) => ({
          id: lista.id,
          nombre: lista.ed
        }))
        const salud = array.arraySalud.map((lista) => ({
          id: lista.id,
          nombre: lista.salud
        }))
        const tratantes = array.arrayTratantes.map((lista) => ({
          id: lista.id,
          nombre: lista.nombre
        }))
        const ts = array.arrayTs.map((lista) => ({
          id: lista.id,
          nombre: lista.nombre
        }))
        const adultos = array.arrayAdultos.map((lista) => ({
          id: lista.id,
          nombre: lista.responsable
        })).sort((a, b) => {
          return a.nombre.localeCompare(b.nombre)
        })
        const nna = array.arrayNna.map((lista) => ({
          id: lista.id,
          nombre: lista.nombre
        })).sort((a, b) => {
          return a.nombre.localeCompare(b.nombre)
        })
        const arraysForList = {
          gen,
          nacion,
          curso,
          comuna,
          parentesco,
          juzgado,
          motivo,
          educacional,
          salud,
          tratantes,
          ts,
          adultos,
          nna
        }
        setListas(arraysForList)
        setLitleCharge(false)
      }).catch((error) => console.error(error))
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
            <Card.Title><Button variant='outline-warning' onClick={() => handleModificar()}>Modificar Datos</Button></Card.Title>
            {modificar
              ? <Card.Body><Button variant='outline-info' onClick={() => handleAddNNa(1)}>Agregar NNJ</Button>
                {litleCharge
                  ? <Spinner
                      as='span'
                      animation='grow'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                  : '👍'}
                <Button variant='outline-info' onClick={() => handleAddNNa(3)}>Cambiar Adulto Responsable</Button>
              </Card.Body>
              : <h3>👩‍💼👩‍👦</h3>}
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
      {listas && (
        <>
          <Modal show={showAdult} onHide={handleCloseAdult} size='xl'>
            <Modal.Header closeButton>
              <Modal.Title> 'Nuevo Adulto Responsable'</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmitAdulto)}>
              <Row className='mb-3'>
                <Form.Group as={Col} md='3' controlId='adultoResponsable'>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    placeholder='Nombre y apellido'
                    {...register('nombre')}
                  />
                  <Form.Control.Feedback>Va bien</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' controlId='validationCustom02'>
                  <Form.Label>Rut</Form.Label>
                  <Form.Control
                    required
                    type='number'
                    placeholder='RUT sin puntos '
                    {...register('rut')}
                  />
                  <Form.Control.Feedback>revisa que esté correcto</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='1' controlId='validationCustom02'>
                  <Form.Label>Dígito</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    placeholder='D'
                    {...register('rutDigito')}
                  />
                  <Form.Control.Feedback>revisa que esté correcto</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='4' controlId='validationCustomUsername'>
                  <Form.Label>Teléfono</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text id='inputGroupPrepend'>📞</InputGroup.Text>
                    <Form.Control
                      type='number'
                      placeholder='Fono (solo números)'
                      aria-describedby='inputGroupPrepend'
                      required
                      {...register('fono')}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Favor ingresa un número válido
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row className='mb-3'>
                <Form.Group as={Col} md='6' controlId='validationCustom03'>
                  <Form.Label>Labores</Form.Label>
                  <Form.Control {...register('labor')} type='text' placeholder='ocupación' required />
                  <Form.Control.Feedback type='invalid'>
                    Elige una ocupación
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='validationCustom04'>
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control {...register('nacimiento')} type='date' placeholder='01' required />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una fecha válida
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='validationCustom05'>
                  <Form.Label>TS a cargo</Form.Label>
                  <Form.Select {...register('ts')} aria-label='Default select example'>
                    <option>Elige a la profesional</option>
                    {listas.ts.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Form.Group className='mb-3'>
                <Form.Check
                  required
                  label='Confirmo que los datos están correctos'
                  feedback='Estoy de acuerdo con enviar estos datos confidenciales'
                  feedbackType='invalid'
                />
              </Form.Group>
              <Button type='submit'>Ingresar nuevo Adulto Responsable</Button>
              <p>------------------------ ó -----------------------</p>
              <Dropdown />
              <Button variant='outline-success' onClick={() => handleAdult()}> el Adulto de NNJ ya estaba ingresado</Button>
            </Form>
          </Modal>

          <Modal show={showNna} onHide={handleCloseNna} size='xl'>
            <Modal.Header closeButton>
              <Modal.Title>'Agregar NNJ'</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmitNna)}>
              <Row className='mb-3'>
                <Form.Group as={Col} md='5' controlId='formBasicName'>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    placeholder='Nombre y ambos apellido'
                    {...register('nombre')}
                  />
                  <Form.Control.Feedback>Va bien</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' controlId='basicRut'>
                  <Form.Label>Rut</Form.Label>
                  <Form.Control
                    required
                    type='number'
                    placeholder='RUT sin puntos '
                    {...register('rut')}
                  />
                  <Form.Control.Feedback>revisa que esté correcto</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='1' controlId='basicDigito'>
                  <Form.Label>Dígito</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    placeholder='D'
                    {...register('rutDigito')}
                  />
                  <Form.Control.Feedback>revisa que esté correcto</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='1' controlId='basicGenero'>
                  <Form.Label>Género</Form.Label>
                  <Form.Select {...register('genero')} aria-label='Default select example'>
                    <option>G</option>
                    {listas.gen.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' controlId='basicNacion'>
                  <Form.Label>Nacionalidad</Form.Label>
                  <Form.Select {...register('nacion')} aria-label='Default select example'>
                    <option>Nacionalidad</option>
                    {listas.nacion.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className='mb-3'>
                <Form.Group as={Col} md='6' controlId='basicDomicilio'>
                  <Form.Label>Domicilio</Form.Label>
                  <Form.Control
                    type='text' placeholder='Donde vive (dirección sin comuna)' required
                    {...register('domicilio')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa domicilio actual
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicComuna'>
                  <Form.Label>Comuna</Form.Label>
                  <Form.Select {...register('comuna')} aria-label='Default select example'>
                    <option>Elige la Comuna</option>
                    {listas.comuna.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicNacimiento'>
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control
                    type='date' placeholder='01' required
                    {...register('nacimiento')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una fecha válida
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicTratante'>
                  <Form.Label>Tratante a cargo</Form.Label>
                  <Form.Select {...register('tratante')} aria-label='Default select example'>
                    <option>Elige a la profesional</option>
                    {listas.tratantes.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' controlId='basicRit'>
                  <Form.Label>Rit</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text id='inputGroupPrepend'>👩‍⚖️</InputGroup.Text>
                    <Form.Control
                      type='text'
                      placeholder='causa P/X'
                      aria-describedby='inputGroupPrepend'
                      required
                      {...register('causa')}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Favor ingresa una causa
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicJuzgado'>
                  <Form.Label>Juzgado</Form.Label>
                  <Form.Select {...register('juzgado')} aria-label='Default select example'>
                    <option>Tribunal</option>
                    {listas.juzgado.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className='mb-3'>
                <Form.Group as={Col} md='3' controlId='basicFechaIngreso'>
                  <Form.Label>Fecha de Ingreso</Form.Label>
                  <Form.Control
                    type='date' placeholder='01' required
                    {...register('ingreso')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una fecha válida
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicMotivo'>
                  <Form.Label>Motivo de Ingreso</Form.Label>
                  <Form.Select {...register('motivo')} aria-label='Default select example'>
                    <option>Principal por</option>
                    {listas.motivo.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicAdultoResponsable'>
                  <Form.Label>Adulto Responsable</Form.Label>
                  <Form.Select {...register('adulto')} aria-label='Default select example'>
                    <option>Elige a la persona a cargo</option>
                    {listas.adultos.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' controlId='basicParentesco'>
                  <Form.Label>Parentesco</Form.Label>
                  <Form.Select {...register('parentesco')} aria-label='Default select example'>
                    <option>Es su (del niño):</option>
                    {listas.parentesco.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className='mb-3'>
                <Form.Group as={Col} md='2' controlId='basicSalud'>
                  <Form.Label>Centro de Salud</Form.Label>
                  <Form.Select {...register('salud')} aria-label='Default select example'>
                    <option>Centro principal:</option>
                    {listas.salud.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicEstablecimiento'>
                  <Form.Label>Establecimiento Educacional</Form.Label>
                  <Form.Select {...register('educacion')} aria-label='Default select example'>
                    <option>EE</option>
                    {listas.educacional.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicCurso'>
                  <Form.Label>Curso</Form.Label>
                  <Form.Select {...register('curso')} aria-label='Default select example'>
                    <option>Cursa</option>
                    {listas.curso.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' controlId='basicDomicilio'>
                  <Form.Label>Código Senainfo/MN</Form.Label>
                  <Form.Control
                    type='number' placeholder='ej. 1968470' required
                    {...register('id')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa domicilio actual
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Form.Group className='mb-3'>
                <Form.Check
                  required
                  label='Confirmo que los datos están correctos'
                  feedback='Estoy de acuerdo con enviar estos datos confidenciales'
                  feedbackType='invalid'
                />
              </Form.Group>
              <Button type='submit'>Ingresar nuevo NNJ</Button>
            </Form>
          </Modal>
          <Modal show={showNewAd} onHide={handleCloseChange}>
            <Modal.Header closeButton>
              <Modal.Title>Cambiar adulto</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmitChange)}>
              <Form.Group as={Col} md='7' controlId='adultoCambio'>
                <Form.Label>Adulto Responsable</Form.Label>
                <Form.Select {...register('responsable')} aria-label='Default select example'>
                  <option>Elige a la persona a cargo</option>
                  {listas.adultos.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md='7' controlId='nnaSuCargo'>
                <Form.Label>NNJ a su cargo</Form.Label>
                <Form.Select {...register('id')} aria-label='Default select example'>
                  <option>NNJ</option>
                  {listas.nna.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md='5' controlId='parentescoAdulto'>
                <Form.Label>Parentesco</Form.Label>
                <Form.Select {...register('parentesco')} aria-label='Default select example'>
                  <option>Es su:</option>
                  {listas.parentesco.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
              <Button type='submit'>Realizar el cambio</Button>
            </Form>
          </Modal>
        </>)}
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
