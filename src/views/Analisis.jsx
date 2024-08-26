import { ListGroup, Container, ProgressBar, Accordion } from 'react-bootstrap'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'

export const Analisis = () => {
  const { getProfesional, duplas } = useContext(Context)
  const [listas, setlistas] = useState(null)
  const casos = getProfesional.casos
  const agrupar = () => {
    const grupos = {}
    duplas.forEach(dupla => {
      grupos[dupla].push(...casos.filter(caso => caso.profesional === dupla))
    })
    setlistas(grupos)
  }

  useEffect(() => {
    agrupar()
    console.log(listas)
  }, [])
  return (
    listas && (
      <>
        <ProgressBar animated now={60} />
        {listas.map((lista) => (
          <ListGroup.Item key={lista.dupla}>
            <Container>
              <Accordion defaultActiveKey='0'>
                {lista.casos.map((caso) => (
                  <Accordion.Item eventKey='0' key={lista.dupla}>
                    <Accordion.Header>{caso.nombre}</Accordion.Header>
                    <Accordion.Body>
                      {caso.resumen}
                    </Accordion.Body>
                    <p>{caso.url}</p>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Container>
          </ListGroup.Item>
        ))}
      </>
    ))
}
