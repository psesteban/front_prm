import Context from '../contexts/context.js'
import { useContext } from 'react'
import { Accordion, ListGroup, Button } from 'react-bootstrap'
import useHandle from '../hooks/useHandle.jsx'
import { Link } from 'react-router-dom'

const Logros = () => {
  const { honor, tareas } = useContext(Context)
  const { palancaTareaCompletada } = useHandle()

  if (honor) {
    return (
      <>
        <h1>Logros</h1>
        <Accordion defaultActiveKey='0'>
          {honor.map((dato, index) => (
            <Accordion.Item key={index} eventKey={index}>
              <Accordion.Header>{dato.medalla}{dato.logro}</Accordion.Header>
              <Accordion.Body>
                {dato.contenido}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        <h1 className='bg-white'>📈</h1>
        {tareas && (<div>
          <h3 className='bg-white'>Compromisos Urgentes</h3>
          <ListGroup as='ul'>
            {tareas.map((tarea, index) => (
              tarea.activa
                ? <ListGroup.Item as='li' key={index} active>
                  {tarea.tarea}
                  <Button variant='outline-info' onClick={() => palancaTareaCompletada(tarea.id)}>⏹️</Button>
                </ListGroup.Item>
                : <ListGroup.Item as='li' key={index} disabled>
                  {tarea.tarea}✅
                </ListGroup.Item>))}
          </ListGroup>
                    </div>)}
      </>
    )
  } else {
    return <button> <Link to='/'>Volvé a la página principal</Link></button>
  }
}

export default Logros
