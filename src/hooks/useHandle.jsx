import { useContext } from 'react'
import Context from '../contexts/context.js'
import useNotify from './useNotify.jsx'
import axios from 'axios'
import accounting from 'accounting'
import { ENDPOINT } from '../config/constans.js'

const useHandle = () => {
  const {
    setShow,
    setShowFormato,
    setShowAdult,
    setShowNna,
    setShowNewAd,
    setLitleCharge,
    setIsLoadData,
    setSelectId,
    setSelectNna,
    setAddNna,
    addNna,
    setDataNna,
    generaWord,
    selectId,
    selectNna,
    setListas,
    getProfesional,
    nombreProfesional
  } = useContext(Context)

  // configuración del modal
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleCloseAdult = () => setShowAdult(false)
  const handleShowAdult = () => setShowAdult(true)
  const handleShowNna = () => setShowNna(true)
  const handleCloseNna = () => setShowNna(false)
  const handleShowChange = () => setShowNewAd(true)
  const handleCloseChange = () => setShowNewAd(false)
  const handleCloseFormato = () => {
    setDataNna(null)
    setSelectId(null)
    setSelectNna(null)
    setShowFormato(false)
  }
  const handleShowFormato = () => setShowFormato(true)

  const handleAdult = () => {
    if (addNna) {
      handleCloseAdult()
      handleAddNNa(2)
    } else {
      handleCloseAdult()
      handleShowChange()
    }
  }
  const handleClick = async (id, nombre) => {
    chosenOne(id, nombre)
    handleShow()
  }
  const handleClickFormato = async (id, nombre, rol) => {
    try {
      chosenOne(id, nombre)
      setIsLoadData(true)
    } catch (error) {
      console.error(error)
    } finally {
      getDataForI(id, rol)
      handleShowFormato()
    }
  }
  const handleClickDescarga = async (tipo) => await generaWord(tipo, 3, 'tratante', 'ts')

  const handleAddNNa = async (etapa) => {
    setLitleCharge(true)
    if (etapa === 1) {
      setAddNna(true)
      handleShowAdult()
    } else if (etapa === 2) handleShowNna()
    else if (etapa === 3) {
      setAddNna(false)
      handleShowAdult()
    } else if (etapa === 4) handleShowChange()
    getListas()
  }

  const chosenOne = (id, nombre) => {
    setSelectId(id)
    setSelectNna(nombre)
  }

  // submit

  const { notify, notifyIngreso } = useNotify()

  const token = window.sessionStorage.getItem('token')

  const onSubmitAdulto = async (datos) => {
    const id = Math.floor(Math.random() * 900 + 2)
    const responsable = datos.nombre
    const nacimiento = datos.nacimiento
    const rutParteA = parseInt(datos.rut)
    const rutDigito = datos.rutDigito
    const run = accounting.formatNumber(rutParteA, 0, '.') + '-' + rutDigito
    const fono = datos.fono
    const labores = datos.labor
    const tsId = datos.ts
    const data = {
      id,
      run,
      responsable,
      nacimiento,
      fono,
      labores,
      tsId
    }
    putAdulto(data)
  }

  const onSubmitNna = async (datos) => {
    const id = datos.id
    const nombre = datos.nombre
    const nacimiento = datos.nacimiento
    const rutParteA = parseInt(datos.rut)
    const rutDigito = datos.rutDigito
    const rut = accounting.formatNumber(rutParteA, 0, '.') + '-' + rutDigito
    const genero = datos.genero
    const nacion = datos.nacion
    const domicilio = datos.domicilio
    const comuna = datos.comuna
    const tratante = datos.tratante
    const causa = datos.causa
    const juzgado = datos.juzgado
    const ingreso = datos.ingreso
    const adulto = datos.adulto
    const motivo = datos.motivo
    const salud = datos.salud
    const educacion = datos.educacion
    const curso = datos.curso
    const parentesco = datos.curso
    const data = {
      id,
      rut,
      nombre,
      nacimiento,
      genero,
      nacion,
      domicilio,
      comuna,
      tratante,
      causa,
      juzgado,
      ingreso,
      adulto,
      parentesco,
      curso,
      motivo,
      salud,
      educacion
    }
    putNna(data)
  }

  const onSubmitChange = async ({ id, parentesco, responsable }) => await axios.put(ENDPOINT.lista, { id, parentesco, responsable }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((r) => handleCloseChange())

  const okButton = async () => {
    await putData(selectId).then((result) => {
      if (result.data === true) {
        notify(selectNna, getProfesional.nombre, 'admin')
        setSelectId(null)
        setSelectNna(null)
      }
    })
    handleClose()
  }
  const okButtonUsuario = () => {
    notify(selectNna)
    putDataUser(selectId)
  }
  // CRUD
  const putDataUser = async (id) => await axios.put(ENDPOINT.user, { rol: nombreProfesional.rol, id }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const putAdulto = async (data) => await axios.put(ENDPOINT.adulto, { data }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((r) => {
    notifyIngreso(data.responsable)
    if (addNna) {
      handleCloseAdult()
      handleAddNNa(2)
    } else {
      handleCloseAdult()
      handleAddNNa(4)
    }
  })
  const putNna = async (data) => await axios.put(ENDPOINT.nna, { data }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((r) => {
    notifyIngreso(data.nombre)
    handleCloseNna()
  })
  const getListas = async () => await axios.get(ENDPOINT.lista, { headers: { Authorization: `Bearer ${token}` } })
    .then((result) => {
      const array = result.data
      const gen = array.arrayGen.map((lista) => ({
        id: lista.id,
        nombre: lista.gen
      }))
      const nacion = array.arrayNacionalidad.map((lista) => ({
        id: lista.id,
        nombre: lista.nacion
      }))
      const curso = array.arrayCurso.map((lista) => ({
        id: lista.id,
        nombre: lista.curso
      }))
      const comuna = array.arrayComuna.map((lista) => ({
        id: lista.id,
        nombre: lista.comuna
      }))
      const parentesco = array.arrayParentesco.map((lista) => ({
        id: lista.id,
        nombre: lista.parentesco
      }))
      const juzgado = array.arrayJuzgado.map((lista) => ({
        id: lista.id,
        nombre: lista.juzgado
      }))
      const motivo = array.arrayMotivo.map((lista) => ({
        id: lista.id,
        nombre: lista.motivo
      }))
      const educacional = array.arrayEducacional.map((lista) => ({
        id: lista.id,
        nombre: lista.ed
      }))
      const salud = array.arraySalud.map((lista) => ({
        id: lista.id,
        nombre: lista.salud
      }))
      const tratantes = array.arrayTratantes.map((lista) => ({
        id: lista.id,
        nombre: lista.nombre
      }))
      const ts = array.arrayTs.map((lista) => ({
        id: lista.id,
        nombre: lista.nombre
      }))
      const adultos = array.arrayAdultos.map((lista) => ({
        id: lista.id,
        nombre: lista.responsable
      })).sort((a, b) => {
        return a.nombre.localeCompare(b.nombre)
      })
      const nna = array.arrayNna.map((lista) => ({
        id: lista.id,
        nombre: lista.nombre
      })).sort((a, b) => {
        return a.nombre.localeCompare(b.nombre)
      })
      const arraysForList = {
        gen,
        nacion,
        curso,
        comuna,
        parentesco,
        juzgado,
        motivo,
        educacional,
        salud,
        tratantes,
        ts,
        adultos,
        nna
      }
      setListas(arraysForList)
      setLitleCharge(false)
    }).catch((error) => console.error(error))

  const putData = async (id) => await axios.put(ENDPOINT.admin, { rol: 3, id }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const getDataForI = async (id, rol) => {
    const params = { id }
    let endpoint = null
    if (rol === 1) endpoint = ENDPOINT.formatos
    else endpoint = ENDPOINT.data
    await axios.get(endpoint, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setIsLoadData(false)
        setDataNna(result.data)
      })
      .catch((error) => {
        setIsLoadData(false)
        console.error(error)
      })
  }
  return {
    handleClose,
    handleShow,
    handleShowAdult,
    handleShowNna,
    handleCloseNna,
    handleCloseChange,
    handleCloseFormato,
    handleCloseAdult,
    handleShowFormato,
    handleClick,
    handleClickFormato,
    handleAdult,
    handleClickDescarga,
    handleAddNNa,
    onSubmitAdulto,
    okButtonUsuario,
    onSubmitChange,
    onSubmitNna,
    okButton
  }
}

export default useHandle
