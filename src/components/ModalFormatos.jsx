import useHandle from '../hooks/useHandle.jsx'
import { Spinner, Button, Modal, Dropdown } from 'react-bootstrap'
import { useContext } from 'react'
import Context from '../contexts/context.js'

const ModalFormatos = () => {
  const {
    showFormato,
    selectNna,
    isLoadData,
    generaWord,
    nombreProfesional
  } = useContext(Context)

  const {
    handleCloseFormato
  } = useHandle()
  return (
    <Modal show={showFormato} onHide={handleCloseFormato}>
      <Modal.Header closeButton>
        <Modal.Title>Formato de Documento de {selectNna}</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Que formato deseas?</Modal.Body>
      <Modal.Footer>
        {!isLoadData
          ? <>
            <Button variant='outline-primary' onClick={() => generaWord(1, nombreProfesional.rol, nombreProfesional.nombre, nombreProfesional.dupla)}> El PII del Diagnóstico</Button>{' '}
            <Button variant='outline-success' onClick={() => generaWord(2, nombreProfesional.rol, nombreProfesional.nombre, nombreProfesional.dupla)}> Formato de PII Tratamiento</Button>
            <Dropdown.Divider />
            <Button variant='info' onClick={() => generaWord(3, nombreProfesional.rol, nombreProfesional.nombre, nombreProfesional.dupla)}> Formato de IPD</Button>{' '}
            <Button variant='success' onClick={() => generaWord(4, nombreProfesional.rol, nombreProfesional.nombre, nombreProfesional.dupla)}> Formato de IA</Button>
            <Dropdown.Divider />
            <Button variant='danger' onClick={() => generaWord(5, nombreProfesional.rol, nombreProfesional.nombre, nombreProfesional.dupla)}> Formato de prórroga</Button>
            </>
          : <Button variant='primary' disabled>
            <Spinner
              as='span'
              animation='border'
              size='sm'
              role='status'
              aria-hidden='true'
            />
            <span className='visually-hidden'>Loading...</span>
            </Button>}
        <Dropdown.Divider />
        <Button variant='secondary' onClick={() => handleCloseFormato()}>
          Ninguno
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalFormatos
