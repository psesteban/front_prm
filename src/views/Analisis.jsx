import { Container, ProgressBar, Accordion, Spinner, Card, Button } from 'react-bootstrap'
import Context from '../contexts/context.js'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useHandle from '../hooks/useHandle.jsx'
import ModalResumen from '../components/ModalResumen.jsx'
import './Analisis.css'
export const Analisis = () => {
  const { getProfesional, duplas, setSelectId, formatoFecha } = useContext(Context)
  const [listas, setListas] = useState({})
  const casos = getProfesional?.casos || false
  const { handleShow, getProfesionalData } = useHandle()
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
    agrupar().then((result) => setListas(result)).catch((error) => {
      console.log(error)
      getProfesionalData()
    })
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
                    {(dato.resumen) ? <div>Último análisis:<h3> {formatoFecha(dato.ultima)}</h3><p>{dato.resumen}</p>Link:<h4>{dato.url}</h4><Button onClick={() => buttonAnalisis(dato.id)}>Registrar Análisis</Button></div> : <Button onClick={() => buttonAnalisis(dato.id)}>Registrar Análisis</Button>}
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
      <div>
        <h1 className='text-center bg-primary text-white rounded'>🍵Me pausé esperando</h1>
        <button> <Link to='/'>Volvé a la página principal</Link></button>
      </div>
    )
  }
}

export default Analisis
