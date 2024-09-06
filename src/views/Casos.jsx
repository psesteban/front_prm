import Context from '../contexts/context.js'
import useHandle from '../hooks/useHandle.jsx'
import { useContext, useEffect } from 'react'
import ModalFormatos from '../components/ModalFormatos.jsx'

import { Accordion, ListGroup, Button, Badge } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const Casos = () => {
  const { getProfesional, formatoFecha, nombreProfesional } = useContext(Context)
  const { handleClickFormato, getListas } = useHandle()
  const calcularEdad = (fecha) => {
    const hoy = new Date()
    const fechaNacimiento = new Date(fecha)
    const diferenciaEnMS = hoy - fechaNacimiento
    const edad = Math.floor(diferenciaEnMS / (1000 * 60 * 60 * 24 * 365.25))
    return `${edad} años`
  }
  const casos = getProfesional.casos.sort((a, b) => {
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

  useEffect(() => {
    if (getProfesional) {
      getListas()
    }
  }, [])

  return (
    <>
      <Accordion defaultActiveKey='0'>
        {casos.map((caso, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>{caso.nombre}</Accordion.Header>
            <Accordion.Body>
              <Badge bg='dark'>{calcularEdad(caso.edad)} al {formatoFecha(caso.edad)}</Badge>
              <Badge bg='secondary'> Rut: {caso.rut}</Badge>
              <Badge bg='warning'>{caso.genero}</Badge>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Badge bg='warning'> Nacionalidad {caso.nacionalidad}</Badge>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  Domicilio: <Badge bg='success'>🏠{caso.domicilio}</Badge>
                  <Badge bg='success'>📫{caso.comuna}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  Redes: <Badge bg='success'>🎒{caso.curso}</Badge> en
                  <Badge bg='success'>🏫{caso.educacional}</Badge> -
                  <Badge bg='warning'>🧑‍⚕️{caso.salud}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  Causa: <Badge bg='secondary'>🏛️{caso.juzgado}</Badge> -
                  <Badge bg='success'>🗃️{caso.rit}</Badge> -
                  <Badge bg='info'>motivo: ❤️‍🩹{caso.motivo}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  Fecha de ingreso a PRM: <Badge bg='dark'>{formatoFecha(caso.fecha)}</Badge> -
                  Tratante: <Badge bg='warning'>⚕️{caso.profesional}</Badge>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  Adulto Responsable: <Badge bg='success'> {caso.adulto}</Badge>
                  <Badge bg='dark'>{calcularEdad(caso.edadAdulto)} al {formatoFecha(caso.edad)}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Badge bg='warning'>Rut: {caso.runAdulto}</Badge>
                  <Badge bg='warning'>🪢{caso.parentesco}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Badge bg='info'>📳{caso.telefono}</Badge>
                  <Badge bg='secondary'>💪{caso.labores}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant='outline-info' onClick={() => handleClickFormato(caso.id, caso.nombre, nombreProfesional.rol)}>📎Conseguir formatos</Button>
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <ModalFormatos />
    </>
  )
}

export default Casos
