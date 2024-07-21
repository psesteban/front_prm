import Context from '../contexts/context.js'
import { useContext, useState } from 'react'
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import { ENDPOINT } from '../config/constans.js'
import Swal from 'sweetalert2'
import axios from 'axios'
import { es } from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
import './Informes.css'

registerLocale('es', es)
setDefaultLocale('es')

const Profile = () => {
  const [startDate, setStartDate] = useState(new Date())
  const token = window.sessionStorage.getItem('token')
  const { getProfesional, fechaEntrega, casos, updateCasos } = useContext(Context)
  const [show, setShow] = useState(false)
  const [selectId, setSelectId] = useState(null)
  const handleClose = () => setShow(false)
  const handleShow = (id) => {
    setShow(true)
    setSelectId(id)
  }
  const updatedCasos = Array.isArray(casos)
    ? casos.map(caso => ({
      ...caso,
      fechaInforme: fechaEntrega(caso.fecha, caso.informe).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }))
    : []
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
      const foundNna = casos.find((nna) => nna.id === id)
      const updateNna = { ...foundNna, prorroga: date }
      const updatedData = getProfesional.casos.map((nna) => {
        if (nna.id === id) {
          return updateNna
        } else {
          return nna
        }
      })
      updateCasos(updatedData)
      handleClose()
      return Swal.fire({
        title: 'fecha actualizada',
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fff url("https://img.freepik.com/vector-gratis/vector-patrones-fisuras-fondo-lindo-memphis_53876-105506.jpg")',
        backdrop: `
              rgba(0,0,123,0.4)
              url("https://i.giphy.com/L5LRkP5bUDFiZee7w2.webp")
              left top
              no-repeat
            `
      })
    } catch (error) {
      Swal.showValidationMessage(`
            Request failed: ${error}`)
    }
  }

  const deleteNna = async (id) => {
    try {
      await axios.delete(ENDPOINT.data, {
        data: { id },
        headers: { Authorization: `Bearer ${token}` }
      })
      const updatedData = casos.filter((nna) => nna.id !== id)
      updateCasos(updatedData)
    } catch (error) {
      console.error('Error al eliminar NNA:', error)
    }
  }

  const handleDelete = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Estas a pundo de eliminar al NNA de la base de datos',
      text: 'Es seguro que esta realizado el egreso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, esta listo',
      cancelButtonText: 'No, aún no🫢',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: 'Eliminado',
          text: '👋',
          icon: 'success'
        })
        deleteNna(id)
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: 'No hay problema',
          text: 'Avísame cuando sea el tiempo',
          icon: 'error'
        })
      }
    })
  }

  return (
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
        {updatedCasos.map((caso) => (
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
            {getProfesional.rol ? <td><Button variant='danger' onClick={() => handleDelete(caso.id)}>X</Button></td> : <></>}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default Profile
