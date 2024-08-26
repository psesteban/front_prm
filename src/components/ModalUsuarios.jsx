import { useContext } from 'react'
import Context from '../contexts/context.js'
import ModalFormatos from './ModalFormatos.jsx'

import { Button, Modal } from 'react-bootstrap'

const ModalUsuario = () => {
  const {
    show,
    handleClose,
    selectNna,
    okButtonUsuario
  } = useContext(Context)
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Envio de Informe</Modal.Title>
        </Modal.Header>
        <Modal.Body>Es seguro que terminaste tu parte del informe de {selectNna}?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Aún no lo termino 🫢
          </Button>
          <Button variant='primary' onClick={okButtonUsuario}>
            Terminado👍
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalFormatos />
    </>
  )
}

export default ModalUsuario