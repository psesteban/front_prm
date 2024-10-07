import { useContext, useState } from 'react'
import Context from '../contexts/context.js'
import { Button, Modal, Dropdown, Form, InputGroup, Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useHandle from '../hooks/useHandle.jsx'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import { es } from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
registerLocale('es', es)
setDefaultLocale('es')

export const ModalAddNew = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [showSecondField, setShowSecondField] = useState(false)
  const [nameCenter, setNameCenter] = useState('')
  const [centerId, setCenterId] = useState('')
  const [selectSalud, setSelectSalud] = useState('')
  const [showSecondFieldE, setShowSecondFieldE] = useState(false)
  const [nameCenterE, setNameCenterE] = useState('')
  const [eId, setEId] = useState('')
  const [selectE, setSelectE] = useState('')
  const { register, handleSubmit } = useForm()

  const {
    listas,
    showAdult,
    showNna,
    showNewAd
  } = useContext(Context)

  const {
    handleCloseAdult,
    onSubmitAdulto,
    handleAdult,
    handleCloseNna,
    onSubmitNna,
    handleCloseChange,
    onSubmitChange,
    handleNewCenter,
    handleNewCenterE
  } = useHandle()
  const handleSelectChange = (event) => {
    setSelectSalud(event.target.value)
    setShowSecondField(event.target.value === 'none')
  }
  const handleSelectSalud = (event) => {
    setNameCenter(event.target.value)
  }
  const handleNewCenterId = (nameCenter) => handleNewCenter(nameCenter).then((result) => {
    const { id } = result[0]
    setCenterId(id)
    setShowSecondField(false)
    setSelectSalud(id)
  })
  const handleSelectChangeE = (event) => {
    setSelectE(event.target.value)
    setShowSecondFieldE(event.target.value === 'none')
  }
  const handleSelectE = (event) => {
    setNameCenterE(event.target.value)
  }
  const handleNewCenterIdE = (nameCenter) => handleNewCenterE(nameCenter).then((result) => {
    const { id } = result[0]
    setEId(id)
    setShowSecondFieldE(false)
    setSelectE(id)
  })

  return (
    <>
      {listas && (

        <>
          <Modal show={showAdult} onHide={handleCloseAdult} size='xl'>
            <Modal.Header closeButton>
              <Modal.Title> 'Nuevo Adulto Responsable'</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmitAdulto)}>
              <Row className='mb-3'>
                <Form.Group as={Col} md='3' controlId='adultoResponsable'>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    placeholder='Nombre y apellido'
                    {...register('nombre')}
                  />
                  <Form.Control.Feedback>Va bien</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' controlId='validationCustom02'>
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
                <Form.Group as={Col} md='4' controlId='validationCustomUsername'>
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
              </Row>
              <Row className='mb-3'>
                <Form.Group as={Col} md='6' controlId='validationCustom03'>
                  <Form.Label>Labores</Form.Label>
                  <Form.Control {...register('labor')} type='text' placeholder='ocupación' required />
                  <Form.Control.Feedback type='invalid'>
                    Elige una ocupación
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='validationCustom04'>
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <DatePicker {...register('nacimiento')} dateFormat='dd-MM-yyyy' selected={startDate} onChange={(date) => setStartDate(date)} />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una fecha válida
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='validationCustom05'>
                  <Form.Label>TS a cargo</Form.Label>
                  <Form.Select {...register('ts')} aria-label='Default select example'>
                    <option>Elige a la profesional</option>
                    {listas.ts.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Form.Group className='mb-3'>
                <Form.Check
                  required
                  label='Confirmo que los datos están correctos'
                  feedback='Estoy de acuerdo con enviar estos datos confidenciales'
                  feedbackType='invalid'
                />
              </Form.Group>
              <Button type='submit'>Ingresar nuevo Adulto Responsable</Button>
              <p>------------------------ ó -----------------------</p>
              <Dropdown />
              <Button variant='outline-success' onClick={() => handleAdult()}> el Adulto de NNJ ya estaba ingresado</Button>
            </Form>
          </Modal>

          <Modal show={showNna} onHide={handleCloseNna} size='xl'>
            <Modal.Header closeButton>
              <Modal.Title>'Agregar NNJ'</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmitNna)}>
              <Row className='mb-3'>
                <Form.Group as={Col} md='5' controlId='formBasicName'>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    placeholder='Nombre y ambos apellido'
                    {...register('nombre')}
                  />
                  <Form.Control.Feedback>Va bien</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' controlId='basicRut'>
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
                <Form.Group as={Col} md='2' controlId='basicNacion'>
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
              </Row>
              <Row className='mb-3'>
                <Form.Group as={Col} md='6' controlId='basicDomicilio'>
                  <Form.Label>Domicilio</Form.Label>
                  <Form.Control
                    type='text' placeholder='Donde vive (dirección sin comuna)' required
                    {...register('domicilio')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa domicilio actual
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicComuna'>
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
                <Form.Group as={Col} md='3' controlId='basicNacimiento'>
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <DatePicker {...register('nacimiento')} dateFormat='dd-MM-yyyy' selected={startDate} onChange={(date) => setStartDate(date)} />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una fecha válida
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicTratante'>
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
                <Form.Group as={Col} md='2' controlId='basicRit'>
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
                <Form.Group as={Col} md='3' controlId='basicJuzgado'>
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
              </Row>
              <Row className='mb-3'>
                <Form.Group as={Col} md='3' controlId='basicFechaIngreso'>
                  <Form.Label>Fecha de Ingreso</Form.Label>
                  <DatePicker {...register('ingreso')} dateFormat='dd-MM-yyyy' selected={startDate} onChange={(date) => setStartDate(date)} />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una fecha válida
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicMotivo'>
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
                <Form.Group as={Col} md='3' controlId='basicAdultoResponsable'>
                  <Form.Label>Adulto Responsable</Form.Label>
                  <Form.Select {...register('adulto')} aria-label='Default select example'>
                    <option>Elige a la persona a cargo</option>
                    {listas.adultos.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' controlId='basicParentesco'>
                  <Form.Label>Parentesco</Form.Label>
                  <Form.Select {...register('parentesco')} aria-label='Default select'>
                    <option>Es su (del niño):</option>
                    {listas.parentesco.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className='mb-3'>
                <Form.Group as={Col} md='2' controlId='basicSalud'>
                  <Form.Label>Centro de Salud</Form.Label>
                  <Form.Select {...register('salud')} aria-label='Default select example' value={selectSalud} onChange={handleSelectChange}>
                    <option value=''>Centro principal:</option>
                    {listas.salud.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                    <option value='none'>otro Centro</option>
                    {centerId && (
                      <option value={centerId}>{nameCenter}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                  {showSecondField && (
                    <Form.Group>
                      <Form.Label>Nuevo Centro de Salud</Form.Label>
                      <Form.Control type='text' placeholder='nombre del Centro' onChange={handleSelectSalud} />
                      <Button variant='outline-success' onClick={() => handleNewCenterId(nameCenter)}> Ingresar</Button>
                    </Form.Group>
                  )}
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicEstablecimiento'>
                  <Form.Label>Establecimiento Educacional</Form.Label>
                  <Form.Select {...register('educacion')} aria-label='Default select example' value={selectE} onChange={handleSelectChangeE}>
                    <option>EE</option>
                    {listas.educacional.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>))}
                    <option value='none'>otro Establecimiento</option>
                    {eId && (
                      <option value={eId}>{nameCenterE}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Ingresa una opción
                  </Form.Control.Feedback>
                  {showSecondFieldE && (
                    <Form.Group>
                      <Form.Label>Nuevo E.E.</Form.Label>
                      <Form.Control type='text' placeholder='nombre del Establecimiento' onChange={handleSelectE} />
                      <Button variant='outline-success' onClick={() => handleNewCenterIdE(nameCenterE)}> Ingresar</Button>
                    </Form.Group>
                  )}
                </Form.Group>
                <Form.Group as={Col} md='3' controlId='basicCurso'>
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
                <Form.Group as={Col} md='2' controlId='basicDomicilio'>
                  <Form.Label>Código Senainfo/MN</Form.Label>
                  <Form.Control
                    type='number' placeholder='ej. 1968470' required
                    {...register('id')}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Ingresa Código exacto
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Form.Group className='mb-3'>
                <Form.Check
                  required
                  label='Confirmo que los datos están correctos'
                  feedback='Estoy de acuerdo con enviar estos datos confidenciales'
                  feedbackType='invalid'
                />
              </Form.Group>
              <Button type='submit'>Ingresar nuevo NNJ</Button>
            </Form>
          </Modal>
          <Modal show={showNewAd} onHide={handleCloseChange}>
            <Modal.Header closeButton>
              <Modal.Title>Cambiar adulto</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmitChange)}>
              <Form.Group as={Col} md='7' controlId='adultoCambio'>
                <Form.Label>Adulto Responsable</Form.Label>
                <Form.Select {...register('responsable')} aria-label='Default select example'>
                  <option>Elige a la persona a cargo</option>
                  {listas.adultos.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md='7' controlId='nnaSuCargo'>
                <Form.Label>NNJ a su cargo</Form.Label>
                <Form.Select {...register('id')} aria-label='Default select example'>
                  <option>NNJ</option>
                  {listas.nna.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md='5' controlId='parentescoAdulto'>
                <Form.Label>Parentesco</Form.Label>
                <Form.Select {...register('parentesco')} aria-label='Default select example'>
                  <option>Es su:</option>
                  {listas.parentesco.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Ingresa una opción
                </Form.Control.Feedback>
              </Form.Group>
              <Button type='submit'>Realizar el cambio</Button>
            </Form>
          </Modal>
        </>
      )}
    </>
  )
}

export const ModalInforme = () => {
  const { show } = useContext(Context)
  const { handleClose, okButton } = useHandle()

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Envio de Informe</Modal.Title>
        </Modal.Header>
        <Modal.Body>Es seguro que el informe está enviado?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Aún no
          </Button>
          <Button variant='primary' onClick={okButton}>
            Enviado👍
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
