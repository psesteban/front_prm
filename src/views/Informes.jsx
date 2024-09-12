import Context from '../contexts/context.js'
import { useContext, useState } from 'react'
import useHandle from '../hooks/useHandle.jsx'
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import { ENDPOINT } from '../config/constans.js'
import axios from 'axios'
import { es } from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Informes.css'

registerLocale('es', es)
setDefaultLocale('es')

const Profile = () => {
  const [startDate, setStartDate] = useState(new Date())
  const token = window.sessionStorage.getItem('token')
  const { getProfesional, fechaEntrega } = useContext(Context)
  const [show, setShow] = useState(false)
  const [selectId, setSelectId] = useState(null)
  const [selectNna, setSelectNna] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [orderByName, setOrderByName] = useState(false)
  const { getProfesionalData } = useHandle()
  const notify = (message) => toast.success(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored'
  })

  const notifyError = (message) => toast.success(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark'
  })

  const handleCloseModal = () => {
    setSelectId(null)
    setShowModal(false)
  }
  const handleClose = () => {
    setSelectId(null)
    setShow(false)
  }
  const handleShowModal = () => setShowModal(true)

  const handleShow = (id) => {
    setShow(true)
    setSelectId(id)
  }
  const updatedCasos = Array.isArray(getProfesional.casos)
    ? getProfesional.casos.map(caso => ({
      ...caso,
      fechaInforme: fechaEntrega(caso.fecha, caso.informe).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }))
    : []

  const casos = orderByName
    ? updatedCasos.sort((a, b) => {
      const nameA = a.nombre.toLowerCase()
      const nameB = b.nombre.toLowerCase()
      if (nameA < nameB) {
        return -1
      } else if (nameA > nameB) {
        return 1
      } else {
        return 0
      }
    })
    : updatedCasos

  const createDate = (date) => new Date(date)
  const formatedDate = (date) => {
    const fecha = createDate(date)
    return fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  // para contar el año
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 335
  const hoy = new Date()
  const hoyMs = hoy.getTime()

  const fechaPrevista = (date) => {
    const fechaAnticipada = new Date(hoy.setMonth(hoy.getMonth() - 1))
    const vencimiento = createDate(date) < fechaAnticipada
    return vencimiento
  }

  // agregar nueva fecha
  const putDataDate = async (id) => {
    try {
      const date = startDate.toISOString().slice(0, 10)
      await axios.put(ENDPOINT.data, { date, id }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const mensaje = `fecha actualizada al 🆕 ${date} 📅`
      notify(mensaje)
      handleClose()
      getProfesionalData()
    } catch (error) {

    }
  }

  const deleteNna = async () => {
    try {
      await axios.delete(ENDPOINT.data, {
        data: { selectId },
        headers: { Authorization: `Bearer ${token}` }
      }).then((result) => {
        const exit = result.data
        if (exit === true) {
          const mensaje = `👋Adios ${selectNna}🖖`
          setSelectId(null)
          notify(mensaje)
          handleCloseModal()
        }
      }
      )
    } catch (error) {
      console.error('Error al eliminar NNA:', error)
      notifyError('error al eliminar de la base de datos, ver consola')
    }
  }

  const handleDelete = (id, nombre) => {
    handleShowModal()
    setSelectId(id)
    setSelectNna(nombre)
  }
  const orderDataByName = () => setOrderByName(true)
  const orderDataByDefault = () => setOrderByName(false)

  return (
    <>
      <Button variant='outline-info' onClick={() => orderDataByName()}>Ordenar por nombre de NNA</Button>{' '}
      <Button variant='outline-info' onClick={() => orderDataByDefault()}>Orden previo</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>⌛ 📄📤</th>
            <th>Prórroga 🗓️</th>
            {getProfesional.rol ? <th>❌</th> : <></>}
          </tr>
        </thead>
        <tbody>
          {casos.map((caso) => (
            <tr key={caso.id}>
              <td>{caso.nombre}</td>
              <td>{caso.fechaInforme}</td>
              <td className={fechaPrevista(caso.prorroga) ? 'normal' : 'marcada'}>{((hoyMs - createDate(caso.fecha).getTime()) >= millisecondsPerYear)
                ? <div>{(createDate(caso.prorroga) >= hoy) ? <div>👀</div> : <div>revisar‼️</div>} {getProfesional.rol
                  ? <div>
                    <p>{formatedDate(caso.prorroga)}</p>
                    <Button variant='primary' onClick={() => handleShow(caso.id)}>
                      🆕📅
                    </Button>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Ingresa la nueva fecha</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Row>
                            <Col>
                              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                            </Col>
                          </Row>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant='secondary' onClick={handleClose}>
                          Cancelar
                        </Button>
                        <Button onClick={() => putDataDate(selectId)}>Guardar cambios</Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                  : <div> {formatedDate(caso.prorroga)} 🔚</div>}
                </div>
                : <p>no corresponde</p>}
              </td>
              {getProfesional.rol ? <td><Button variant='danger' onClick={() => handleDelete(caso.id, caso.nombre)}>X</Button></td> : <></>}
            </tr>
          ))}
        </tbody>
        <Modal show={showModal} onHide={() => { handleCloseModal() }}>
          <Modal.Header closeButton>
            <Modal.Title>Eliminar de la base de datos</Modal.Title>
          </Modal.Header>
          <Modal.Body>Es seguro que esta listo el Egreso?</Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => { handleCloseModal() }}>
              Aún no🫢
            </Button>
            <Button variant='primary' onClick={() => { deleteNna() }}>
              Si👍
            </Button>
          </Modal.Footer>
        </Modal>
      </Table>
    </>
  )
}

export default Profile
