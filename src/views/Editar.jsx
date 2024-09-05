import Context from '../contexts/context.js'
import useHandle from '../hooks/useHandle.jsx'
import { ModalAddNew } from '../components/ModalAdmin.jsx'
import { ModalCambios } from '../components/ModalCambios.jsx'
import ModalLogros from '../components/ModalLogros.jsx'
import ModalFormatos from '../components/ModalFormatos.jsx'
import { useContext, useEffect, useState } from 'react'
import { Spinner, Dropdown, DropdownButton, Accordion, Button, ListGroup } from 'react-bootstrap'

const Editar = () => {
  const [listas, setListas] = useState({})

  const {
    getProfesional,
    litleCharge,
    setTipo,
    setShowAdultChange,
    setShowNnaChange,
    setSelectId,
    formatoFecha,
    setShowLogros,
    honor
  } = useContext(Context)
  const {
    handleAddNNa,
    getListas,
    handleClickFormato,
    getProfesionales,
    getLogros,
    deleteLogro
  } = useHandle()

  const handleCambio = (tipo, id) => {
    setTipo(tipo)
    setSelectId(id)
    if (tipo > 0 && tipo < 17) {
      setShowNnaChange(true)
    } else if (tipo > 16) {
      setShowAdultChange(true)
    }
  }
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
  const agrupar = async () => {
    const grupos = honor.reduce((acc, persona) => {
      const nombre = persona.nombre
      acc[nombre] = acc[nombre] || []
      acc[nombre].push(persona)
      return acc
    }, {})
    return grupos
  }
  useEffect(() => {
    if (getProfesional.id) {
      getListas()
      getProfesionales(getProfesional.id)
      getLogros(getProfesional.id)
      console.log(honor)
      agrupar().then((result) => setListas(result))
    }
  }, [])

  return (
    <>
      <h1>Profesionales</h1>
      <Button variant='outline-success' onClick={() => setShowLogros(true)}>Agregar Logro</Button>
      <Accordion defaultActiveKey='0'>
        {Object.entries(listas).map(([nombre, datosPersona], index) => (
          <Accordion.Item key={index} eventKey={index}>
            <Accordion.Header>{nombre}</Accordion.Header>
            <Accordion.Body>
              <ListGroup variant='flush'>
                {datosPersona.map((dato, index) => (
                  <ListGroup.Item key={index}>
                    <h2>{dato.logro} {dato.medalla}</h2>
                    <Button variant='outline-danger' onClick={() => deleteLogro(dato.id)}> Eliminar</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <h1>Casos</h1>
      <DropdownButton
        id='dropdown-item-button' title={litleCharge
          ? <Spinner
              as='span'
              animation='grow'
              size='sm'
              role='status'
              aria-hidden='true'
            />
          : 'Agregar 👩‍👧‍👦'}
      >
        <Dropdown.ItemText>Modificar Datos 👇</Dropdown.ItemText>
        <Dropdown.Item as='button' onClick={() => handleAddNNa(1)}>Agregar NNJ</Dropdown.Item>
        <Dropdown.Item as='button' onClick={() => handleAddNNa(3)}>Cambiar Adulto Responsable</Dropdown.Item>
      </DropdownButton>
      <Accordion defaultActiveKey='0'>
        {casos.map((caso, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>{caso.nombre}</Accordion.Header>
            <Accordion.Body>
              <Button variant='outline-danger' onClick={() => handleCambio(1, caso.id)}>Cambiar Nombre</Button>
              <Button variant='outline-info' onClick={() => handleCambio(7, caso.id)}>{calcularEdad(caso.edad)} al {formatoFecha(caso.edad)}</Button>
              <Button variant='outline-info' onClick={() => handleCambio(2, caso.id)}> Rut: {caso.rut}</Button>
              <Button variant='outline-info' onClick={() => handleCambio(3, caso.id)}>{caso.genero}</Button>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Button variant='outline-info' onClick={() => handleCambio(4, caso.id)}> Nacionalidad {caso.nacionalidad}</Button>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  Domicilio: <Button variant='outline-info' onClick={() => handleCambio(5, caso.id)}>🏠{caso.domicilio}</Button>
                  <Button variant='outline-info' onClick={() => handleCambio(6, caso.id)}>📫{caso.comuna}</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  Redes: <Button variant='outline-info' onClick={() => handleCambio(16, caso.id)}>🎒{caso.curso}</Button> en
                  <Button variant='outline-info' onClick={() => handleCambio(15, caso.id)}>🏫{caso.educacional}</Button> -
                  <Button variant='outline-info' onClick={() => handleCambio(14, caso.id)}>🧑‍⚕️{caso.salud}</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  Causa: <Button variant='outline-info' onClick={() => handleCambio(10, caso.id)}>🏛️{caso.juzgado}</Button> -
                  <Button variant='outline-info' onClick={() => handleCambio(9, caso.id)}>🗃️{caso.rit}</Button> -
                  <Button variant='outline-info' onClick={() => handleCambio(12, caso.id)}>motivo: ❤️‍🩹{caso.motivo}</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  Fecha de ingreso a PRM: <Button variant='outline-info' onClick={() => handleCambio(11, caso.id)}>{formatoFecha(caso.fecha)}</Button> -
                  Tratante: <Button variant='outline-info' onClick={() => handleCambio(8, caso.id)}>⚕️{caso.profesional}</Button>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  Adulto Responsable: <Button variant='outline-info' onClick={() => handleCambio(17, caso.idAdulto)}> {caso.adulto}</Button>
                  <Button variant='outline-info' onClick={() => handleCambio(21, caso.idAdulto)}>{calcularEdad(caso.edadAdulto)} al {formatoFecha(caso.edad)}</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant='outline-info' onClick={() => handleCambio(18, caso.idAdulto)}>Rut: {caso.runAdulto}</Button>
                  <Button variant='outline-info' onClick={() => handleCambio(13, caso.id)}>🪢{caso.parentesco}</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant='outline-info' onClick={() => handleCambio(19, caso.idAdulto)}>📳{caso.telefono}</Button>
                  <Button variant='outline-info' onClick={() => handleCambio(20, caso.idAdulto)}>💪{caso.labores}</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant='outline-info' onClick={() => handleClickFormato(caso.id, caso.nombre, 1)}>📎Conseguir formatos</Button>
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <ModalAddNew />
      <ModalCambios />
      <ModalFormatos />
      <ModalLogros />
    </>
  )
}

export default Editar
