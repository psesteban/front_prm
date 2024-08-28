import { useContext } from 'react'
import Context from '../contexts/context.js'
import { useForm } from 'react-hook-form'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'
import useHandle from '../hooks/useHandle.jsx'

const ModalResumen = () => {
  const { register, handleSubmit } = useForm()

  const { show } = useContext(Context)

  const {
    handleClose,
    onSubmitAnalisis
  } = useHandle()

  return (
    <>
      <Modal show={show} onHide={handleClose} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Ingreso de Análisis de Caso</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmitAnalisis)}>
          <Row className='mb-3'>
            <Form.Group as={Col} md='10' controlId='analisis'>
              <Form.Label>Análisis Breve</Form.Label>
              <Form.Control
                required
                type='text'
                as='textarea'
                rows={10}
                placeholder='Resumen del caso'
                {...register('resumen')}
              />
              <Form.Control.Feedback>Va bien</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group as={Col} md='8' controlId='url'>
            <Form.Label>URL</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='url del docs con el ánalisis completo'
              {...register('url')}
            />
            <Form.Control.Feedback>revisa que esté correcto</Form.Control.Feedback>
          </Form.Group>
          <Button type='submit'>Ingresar Análisis</Button>
        </Form>
      </Modal>
    </>
  )
}

export default ModalResumen
