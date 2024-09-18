import { useContext } from 'react'
import Context from '../contexts/context.js'
import { Button, Modal, Dropdown, Form, Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useHandle from '../hooks/useHandle.jsx'

const ModalTareas = () => {
  const { register, handleSubmit } = useForm()
  const {
    showTareas,
    personas
  } = useContext(Context)

  const {
    onSubmitTareas,
    handleCloseTareas
  } = useHandle()

  return (
    <Modal show={showTareas} onHide={handleCloseTareas} size='xl'>
      <Modal.Header closeButton>
        <Modal.Title> Inserta el nuevo logro</Modal.Title>
      </Modal.Header>
      {personas && (
        <Form onSubmit={handleSubmit(onSubmitTareas)}>
          <Row className='mb-3'>
            <Form.Group as={Col} md='10' controlId='adultoResponsable'>
              <Form.Label>Ingresa la tarea</Form.Label>
              <Form.Control
                required
                type='text'
                rows={3}
                placeholder='Breve Descripción'
                {...register('tarea')}
              />
              <Form.Control.Feedback>Va bien</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group as={Col} md='3' controlId='validationCustom05'>
            <Form.Label>Profesional elegida</Form.Label>
            <Form.Select {...register('id')} aria-label='Default select example'>
              <option>Elige a la profesional</option>
              {personas.map((persona, index) => (<option key={index} value={persona.id}>{persona.nombre}</option>))}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              Ingresa una opción
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Check
              required
              label='Confirmo'
              feedback='Estoy de acuerdo con enviar esta tarea'
              feedbackType='invalid'
            />
          </Form.Group>
          <Button type='submit'>Enviar Tarea</Button>
          <Dropdown />
        </Form>
      )}
    </Modal>
  )
}
export default ModalTareas
