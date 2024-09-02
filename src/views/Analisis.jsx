import { Container, ProgressBar, Accordion, Spinner, Card, Button } from 'react-bootstrap'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'
import useHandle from '../hooks/useHandle.jsx'
import ModalResumen from '../components/ModalResumen.jsx'
import './Analisis.css'
export const Analisis = () => {
  const { getProfesional, duplas, setSelectId } = useContext(Context)
  const [listas, setListas] = useState({})
  const casos = getProfesional.casos
  const { handleShow } = useHandle()
  const agrupar = async () => {
    const grupos = {}
    await duplas.forEach(dupla => {
      grupos[dupla] = grupos[dupla] ?? []
      grupos[dupla].push(...casos.filter(caso => caso.profesional === dupla))
    })
    return grupos
  }

  const buttonAnalisis = (id) => {
    setSelectId(id)
    handleShow()
  }

  useEffect(() => {
    agrupar().then((result) => setListas(result))
    console.log(listas)
  }, [])

  if (Object.keys(listas).length > 1) {
    return (
      <Container>
        <ProgressBar animated now={60} />
        {Object.entries(listas).map(([nombre, datosPersona]) => (
          <Card key={nombre}>
            <h2>{nombre}</h2>
            <Accordion defaultActiveKey='0'>
              {datosPersona.map((dato, index) => (
                <Accordion.Item eventKey={index} key={index}>
                  <Accordion.Header>{(dato.resumen) ? '🗒️' : '🅾'}{dato.nombre}</Accordion.Header>
                  <Accordion.Body>
                    {(dato.resumen) ? <div><h1>{dato.ultima}</h1><p>{dato.resumen}</p><h4>{dato.url}</h4></div> : <Button onClick={() => buttonAnalisis(dato.id)}>Registrar Análisis</Button>}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card>
        ))}
        <ModalResumen />
      </Container>
    )
  } else {
    return (
      <h1>Espere por favor
        <Spinner
          as='span'
          animation='grow'
          size='sm'
          role='status'
          aria-hidden='true'
        />
      </h1>
    )
  }
}

export default Analisis
