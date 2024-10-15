import Context from '../contexts/context.js'
import useHandle from '../hooks/useHandle.jsx'
import ModalLogros from '../components/ModalLogros.jsx'
import { useContext, useEffect, useState } from 'react'
import { Accordion, Button, ListGroup } from 'react-bootstrap'
import ModalTareas from '../components/ModalTareas.jsx'
import { Link } from 'react-router-dom'

const Editar = () => {
  const [listas, setListas] = useState({})
  const [listaDos, setListaDos] = useState({})

  const {
    getProfesional,
    setShowLogros,
    honor,
    tareas,
    setShowTareas
  } = useContext(Context)
  const {
    getListas,
    getProfesionales,
    getLogros,
    deleteLogro,
    deleteTarea,
    activar,
    getTareasAdmin
  } = useHandle()

  const agrupar = async () => {
    const grupos = honor.reduce((acc, persona) => {
      const nombre = persona.nombre
      acc[nombre] = acc[nombre] || []
      acc[nombre].push(persona)
      return acc
    }, {})
    return grupos
  }
  const agruparTareas = async () => {
    const grupos = tareas.reduce((acc, persona) => {
      const nombre = persona.nombre
      acc[nombre] = acc[nombre] || []
      acc[nombre].push(persona)
      return acc
    }, {})
    return grupos
  }
  useEffect(() => {
    if (getProfesional) {
      if (getProfesional.id) {
        getListas()
        getProfesionales(getProfesional.id)
        getLogros(getProfesional.id)
        getTareasAdmin(getProfesional.id)
        agrupar().then((result) => setListas(result))
        agruparTareas().then((result) => setListaDos(result))
      }
    }
  }, [])

  if (getProfesional) {
    return (
      <>
        {listas && (<> <h1 className='text-center bg-primary text-white rounded'>Profesionales</h1>
          <h3>Logros</h3>
          <Button variant='success' onClick={() => setShowLogros(true)}>Agregar Logro</Button>
          <Accordion defaultActiveKey='0'>
            {Object.entries(listas).map(([nombre, datosPersona], index) => (
              <Accordion.Item key={index} eventKey={index}>
                <Accordion.Header>{nombre}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant='flush'>
                    {datosPersona.map((dato, index) => (
                      <ListGroup.Item key={index}>
                        <h4>{dato.logro} {dato.medalla}</h4>
                        <Button variant='outline-danger' onClick={() => deleteLogro(dato.id)}> Eliminar</Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
          <h3>Tareas</h3>
          <Button variant='outline-success' onClick={() => setShowTareas(true)}>Agregar Tarea</Button>
          <Accordion defaultActiveKey='0'>
            {Object.entries(listaDos).map(([nombre, datosPersona], index) => (
              <Accordion.Item key={index} eventKey={index}>
                <Accordion.Header>{nombre}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant='flush'>
                    {datosPersona.map((dato, index) => (
                      <ListGroup.Item key={index}>
                        <h4>{dato.tarea} {dato.activa ? <Button variant='outline-info' onClick={() => activar(dato.id)}>Activar</Button> : '⏩'}</h4>
                        <Button variant='outline-danger' onClick={() => deleteTarea(dato.id)}> Eliminar</Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
        )}
        <ModalLogros />
        <ModalTareas />
      </>
    )
  } else {
    return (
      <div>
        <h1 className='text-center bg-primary text-white rounded'>🍵Me pausé esperando</h1>
        <button> <Link to='/'>Volvé a la página principal</Link></button>
      </div>
    )
  }
}

export default Editar
