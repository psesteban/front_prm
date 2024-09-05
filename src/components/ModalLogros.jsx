import { useContext } from 'react'
import Context from '../contexts/context.js'
import { Button, Modal, Dropdown, Form, Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useHandle from '../hooks/useHandle.jsx'

const ModaLogros = () => {
  const { register, handleSubmit } = useForm()
  const distintivos = ['😜', '👩‍👧‍👦', '⚕️', '💻', '📝', '🧠', '👀', '🎀', '🎗️', '🪢', '💎', '🔐', '⚖️', '💵', '📈', '🧭', '☮️', '🚼', '🔆', '🕐', '💬']
  const {
    showLogros,
    personas
  } = useContext(Context)

  const {
    onSubmitLogros,
    handleCloseLogro
  } = useHandle()

  return (
    <Modal show={showLogros} onHide={handleCloseLogro} size='xl'>
      <Modal.Header closeButton>
        <Modal.Title> Inserta el nuevo logro</Modal.Title>
      </Modal.Header>
      {personas && (
        <Form onSubmit={handleSubmit(onSubmitLogros)}>
          <Row className='mb-3'>
            <Form.Group as={Col} md='8' controlId='adultoResponsable'>
              <Form.Label>Ingresa el atributo o logro destacable</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='En una frase'
                {...register('logro')}
              />
              <Form.Control.Feedback>Va bien</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className='mb-3'>
            <Form.Group as={Col} md='10' controlId='analisis'>
              <Form.Label>Describe el logro o atributo destacable</Form.Label>
              <Form.Control
                required
                type='text'
                as='textarea'
                rows={3}
                placeholder='descripción breve'
                {...register('contenido')}
              />
              <Form.Control.Feedback>Va bien</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group as={Col} md='1' controlId='validationCustom02'>
            <Form.Label>Distintivo</Form.Label>
            <Form.Select {...register('medalla')} aria-label='Default select example'>
              <option>Elige un distintivo del logro</option>
              {distintivos.map((e, index) => (<option key={index} value={e}>{e}</option>))}
            </Form.Select>
            <Form.Control.Feedback>Tan solo elige uno</Form.Control.Feedback>
          </Form.Group>
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
              feedback='Estoy de acuerdo con destacar esto'
              feedbackType='invalid'
            />
          </Form.Group>
          <Button type='submit'>Destacar</Button>
          <Dropdown />
        </Form>
      )}
    </Modal>
  )
}
export default ModaLogros
