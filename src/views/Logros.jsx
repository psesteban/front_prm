import Context from '../contexts/context.js'
import { useContext } from 'react'
import { Accordion } from 'react-bootstrap'

const Logros = () => {
  const { honor } = useContext(Context)

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

    </>
  )
}

export default Logros
