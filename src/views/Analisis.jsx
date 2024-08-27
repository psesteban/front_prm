import { Container, ProgressBar, Accordion, Spinner, Card } from 'react-bootstrap'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'
import './Analisis.css'

export const Analisis = () => {
  const { getProfesional, duplas } = useContext(Context)
  const [listas, setListas] = useState({})
  const casos = getProfesional.casos

  const agrupar = async () => {
    const grupos = {}
    await duplas.forEach(dupla => {
      grupos[dupla] = grupos[dupla] ?? []
      grupos[dupla].push(...casos.filter(caso => caso.profesional === dupla))
    })
    return grupos
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
                  <Accordion.Header>{dato.nombre}</Accordion.Header>
                  <Accordion.Body>
                    {dato.resumen}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card>
        ))}
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
