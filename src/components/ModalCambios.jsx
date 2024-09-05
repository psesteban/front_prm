import { useContext } from 'react'
import Context from '../contexts/context.js'
import { Button, Modal, Dropdown, Form, InputGroup, Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useHandle from '../hooks/useHandle.jsx'

export const ModalCambios = () => {
  const { register, handleSubmit } = useForm()

  const {
    listas,
    tipo,
    showNnaChange,
    showAdultChange
  } = useContext(Context)

  const {
    handleCloseAdultChange,
    handleCloseNnaChange,
    onSubmitChangeNna,
    onSubmitChangeAdult
  } = useHandle()

  return (
    <>
      <Modal show={showAdultChange} onHide={handleCloseAdultChange} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title> 'Nuevo Adulto Responsable'</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmitChangeAdult)}>
          <Row className='mb-3'>
            {tipo === 17 && (
              <Form.Group as={Col} md='13' controlId='adultoResponsable'>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  required
                  type='text'
                  placeholder='Nombre y apellido'
                  {...register('nombre')}
                />
                <Form.Control.Feedback>Va bien</Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 18 && (<>
              <Form.Group as={Col} md='5' controlId='validationCustom02'>
                <Form.Label>Rut</Form.Label>
                <Form.Control
                  required
                  type='number'
                  placeholder='RUT sin puntos '
                  {...register('rut')}
                />
                <Form.Control.Feedback>revisa que esté correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md='1' controlId='validationCustom02'>
                <Form.Label>Dígito</Form.Label>
                <Form.Control
                  required
                  type='text'
                  placeholder='D'
                  {...register('rutDigito')}
                />
                <Form.Control.Feedback>revisa que esté correcto</Form.Control.Feedback>
              </Form.Group>
            </>
            )}
            {tipo === 19 && (
              <Form.Group as={Col} md='6' controlId='validationCustomUsername'>
                <Form.Label>Teléfono</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id='inputGroupPrepend'>📞</InputGroup.Text>
                  <Form.Control
                    type='number'
                    placeholder='Fono (solo números)'
                    aria-describedby='inputGroupPrepend'
                    required
                    {...register('fono')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Favor ingresa un número válido
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}
            {tipo === 20 && (
              <Form.Group as={Col} md='6' controlId='validationCustom03'>
                <Form.Label>Labores</Form.Label>
                <Form.Control {...register('labor')} type='text' placeholder='ocupación' required />
                <Form.Control.Feedback type='invalid'>
                  Elige una ocupación
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 21 && (
              <Form.Group as={Col} md='5' controlId='validationCustom04'>
                <Form.Label>Fecha de nacimiento</Form.Label>
                <Form.Control {...register('nacimiento')} type='date' placeholder='01' required />
                <Form.Control.Feedback type='invalid'>
                  Ingresa una fecha válida
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Row>
          <Form.Group className='mb-3'>
            <Form.Check
              required
              label='Confirmo que los datos están correctos'
              feedback='Estoy de acuerdo con enviar estos datos confidenciales'
              feedbackType='invalid'
            />
          </Form.Group>
          <Dropdown />
          <Button type='submit'>Ingresar cambios</Button>
        </Form>
      </Modal>

      <Modal show={showNnaChange} onHide={handleCloseNnaChange} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>'Cambiar dato de NNJ'</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmitChangeNna)}>
          <Row className='mb-3'>
            {tipo === 1 && (
              <Form.Group as={Col} md='12' controlId='formBasicName'>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  required
                  type='text'
                  placeholder='Nombre y ambos apellido'
                  {...register('nombre')}
                />
                <Form.Control.Feedback>Va bien</Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 2 && (
              <>
                <Form.Group as={Col} md='5' controlId='basicRut'>
                  <Form.Label>Rut</Form.Label>
                  <Form.Control
                    required
                    type='number'
                    placeholder='RUT sin puntos '
                    {...register('rut')}
                  />
                  <Form.Control.Feedback>revisa que esté correcto</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='1' controlId='basicDigito'>
                  <Form.Label>Dígito</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    placeholder='D'
                    {...register('rutDigito')}
                  />
                  <Form.Control.Feedback>revisa que esté correcto</Form.Control.Feedback>
                </Form.Group>
              </>
            )}
            {tipo === 3 && (
              <Form.Group as={Col} md='1' controlId='basicGenero'>
                <Form.Label>Género</Form.Label>
                <Form.Select {...register('genero')} aria-label='Default select example'>
                  <option>G</option>
                  {listas.gen.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 4 && (

              <Form.Group as={Col} md='5' controlId='basicNacion'>
                <Form.Label>Nacionalidad</Form.Label>
                <Form.Select {...register('nacion')} aria-label='Default select example'>
                  <option>Nacionalidad</option>
                  {listas.nacion.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 5 && (
              <Form.Group as={Col} md='12' controlId='basicDomicilio'>
                <Form.Label>Domicilio</Form.Label>
                <Form.Control
                  type='text' placeholder='Donde vive (dirección sin comuna)' required
                  {...register('domicilio')}
                />
                <Form.Control.Feedback type='invalid'>
                  Ingresa domicilio actual
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 6 && (
              <Form.Group as={Col} md='6' controlId='basicComuna'>
                <Form.Label>Comuna</Form.Label>
                <Form.Select {...register('comuna')} aria-label='Default select example'>
                  <option>Elige la Comuna</option>
                  {listas.comuna.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 7 && (
              <Form.Group as={Col} md='5' controlId='basicNacimiento'>
                <Form.Label>Fecha de nacimiento</Form.Label>
                <Form.Control
                  type='date' placeholder='01' required
                  {...register('nacimiento')}
                />
                <Form.Control.Feedback type='invalid'>
                  Ingresa una fecha válida
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 8 && (
              <Form.Group as={Col} md='6' controlId='basicTratante'>
                <Form.Label>Tratante a cargo</Form.Label>
                <Form.Select {...register('tratante')} aria-label='Default select example'>
                  <option>Elige a la profesional</option>
                  {listas.tratantes.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 9 && (
              <Form.Group as={Col} md='5' controlId='basicRit'>
                <Form.Label>Rit</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id='inputGroupPrepend'>👩‍⚖️</InputGroup.Text>
                  <Form.Control
                    type='text'
                    placeholder='causa P/X'
                    aria-describedby='inputGroupPrepend'
                    required
                    {...register('causa')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Favor ingresa una causa
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}
            {tipo === 10 && (
              <Form.Group as={Col} md='4' controlId='basicJuzgado'>
                <Form.Label>Juzgado</Form.Label>
                <Form.Select {...register('juzgado')} aria-label='Default select example'>
                  <option>Tribunal</option>
                  {listas.juzgado.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 11 && (
              <Form.Group as={Col} md='5' controlId='basicFechaIngreso'>
                <Form.Label>Fecha de Ingreso</Form.Label>
                <Form.Control
                  type='date' placeholder='01' required
                  {...register('ingreso')}
                />
                <Form.Control.Feedback type='invalid'>
                  Ingresa una fecha válida
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 12 && (
              <Form.Group as={Col} md='6' controlId='basicMotivo'>
                <Form.Label>Motivo de Ingreso</Form.Label>
                <Form.Select {...register('motivo')} aria-label='Default select example'>
                  <option>Principal por</option>
                  {listas.motivo.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 13 && (
              <Form.Group as={Col} md='4' controlId='basicParentesco'>
                <Form.Label>Parentesco</Form.Label>
                <Form.Select {...register('parentesco')} aria-label='Default select example'>
                  <option>Es su (del niño):</option>
                  {listas.parentesco.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 14 && (
              <Form.Group as={Col} md='5' controlId='basicSalud'>
                <Form.Label>Centro de Salud</Form.Label>
                <Form.Select {...register('salud')} aria-label='Default select example'>
                  <option>Centro principal:</option>
                  {listas.salud.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 15 && (
              <Form.Group as={Col} md='3' controlId='basicEstablecimiento'>
                <Form.Label>Establecimiento Educacional</Form.Label>
                <Form.Select {...register('educacion')} aria-label='Default select example'>
                  <option>EE</option>
                  {listas.educacional.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {tipo === 16 && (
              <Form.Group as={Col} md='4' controlId='basicCurso'>
                <Form.Label>Curso</Form.Label>
                <Form.Select {...register('curso')} aria-label='Default select example'>
                  <option>Cursa</option>
                  {listas.curso.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Row>
          <Form.Group className='mb-3'>
            <Form.Check
              required
              label='Confirmo que los datos están correctos'
              feedback='Estoy de acuerdo con enviar estos datos confidenciales'
              feedbackType='invalid'
            />
          </Form.Group>
          <Button type='submit'>Ingresar cambios</Button>
        </Form>
      </Modal>
    </>
  )
}
