import useHandle from '../hooks/useHandle.jsx'
import { Spinner, Button, Modal, Dropdown } from 'react-bootstrap'
import { useContext } from 'react'
import Context from '../contexts/context.js'

const ModalFormatos = () => {
  const {
    showFormato,
    selectNna,
    isLoadData
  } = useContext(Context)

  const {
    handleCloseFormato,
    handleClickDescarga
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
            <Button variant='outline-primary' onClick={() => handleClickDescarga(1)}> El PII del Diagnóstico</Button>{' '}
            <Button variant='outline-success' onClick={() => handleClickDescarga(2)}> Formato de PII Tratamiento</Button>
            <Dropdown.Divider />
            <Button variant='info' onClick={() => handleClickDescarga(3)}> Formato de IPD</Button>{' '}
            <Button variant='success' onClick={() => handleClickDescarga(4)}> Formato de IA</Button>
            <Dropdown.Divider />
            <Button variant='danger' onClick={() => handleClickDescarga(5)}> Formato de prórroga</Button>
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
