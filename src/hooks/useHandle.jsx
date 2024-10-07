import { useContext } from 'react'
import Context from '../contexts/context.js'
import useNotify from './useNotify.jsx'
import axios from 'axios'
import accounting from 'accounting'
import { ENDPOINT } from '../config/constans.js'
import { useNavigate } from 'react-router-dom'

const useHandle = () => {
  const navigate = useNavigate()
  const token = window.sessionStorage.getItem('token')

  const {
    tipo,
    setTipo,
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
    selectId,
    selectNna,
    setListas,
    getProfesional,
    setProfesional,
    setIsLoading,
    setShowNnaChange,
    setShowAdultChange,
    setHonor,
    setPersonas,
    setShowLogros,
    setSesion,
    setTareas,
    tareas,
    setShowTareas
  } = useContext(Context)

  // configuración del modal
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleCloseAdult = () => setShowAdult(false)
  const handleShowAdult = () => setShowAdult(true)
  const handleShowNna = () => setShowNna(true)
  const handleCloseNna = () => setShowNna(false)
  const handleCloseLogro = () => setShowLogros(false)
  const handleShowChange = () => setShowNewAd(true)
  const handleCloseChange = () => setShowNewAd(false)
  const handleCloseTareas = () => setShowTareas(false)

  const handleCloseFormato = () => {
    setDataNna(null)
    setSelectId(null)
    setSelectNna(null)
    setShowFormato(false)
  }
  const handleShowFormato = () => setShowFormato(true)

  const handleCloseAdultChange = () => {
    setShowAdultChange(false)
    setSelectId(null)
    setTipo(0)
  }
  const handleCloseNnaChange = () => {
    setShowNnaChange(false)
    setSelectId(null)
    setTipo(0)
  }

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

  const { notify, notifyIngreso, notifyXpress } = useNotify()

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
    postAdulto(data)
  }

  const onSubmitAnalisis = async (datos) => {
    const id = selectId
    const resumen = datos.resumen
    const url = datos.url
    const date = new Date()
    postAnalisis(id, date, resumen, url)
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
    const parentesco = datos.parentesco
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
    postNna(data)
  }

  const onSubmitChange = async ({ id, parentesco, responsable }) => await axios.put(ENDPOINT.lista, { id, parentesco, responsable }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((r) => {
    if (r.data) {
      notifyXpress('dato de adulto responsable modificado')
      handleCloseChange()
      getProfesionalData()
    }
  }
  )

  const palancaTareaCompletada = async (id) => {
    await axios.put(ENDPOINT.tareas, { id }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => {
      if (r.data) {
        setTareas(tareas => {
          return tareas.map(tarea => {
            if (tarea.id === id) {
              return { ...tarea, activa: !tarea.activa }
            }
            return tarea
          })
        })
      }
    })
  }
  const palancaActivarTarea = async (idTarea) => {
    await axios.put(ENDPOINT.task, { idTarea }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => {
      if (r.data) {
        notifyXpress('activando la Tarea')
      }
    })
  }
  const getTareas = async (id) => {
    const params = { id }
    await axios.get(ENDPOINT.tareas, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setTareas(result.data)
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
  }
  const getTareasAdmin = async (id) => {
    const params = { id }
    await axios.get(ENDPOINT.task, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setTareas(result.data)
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
  }
  const onSubmitTareas = async (input) => {
    const tareas = {
      id: input.id,
      tarea: input.tarea
    }

    await axios.post(ENDPOINT.task, { tareas }, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        if (result.status === 200) notifyXpress('tarea subida')
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
    setShowTareas(false)
  }
  const deleteTarea = async (id) => {
    const params = { id }

    await axios.delete(ENDPOINT.task, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        if (result.data) {
          setTareas(tareas => {
            return tareas.filter(tarea => tarea.id !== id)
          })
          notifyXpress('tarea borrada')
        }
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
  }
  const onSubmitChangeNna = async (input) => {
    const id = selectId
    let data = input
    if (tipo === 2) {
      const rutParteA = parseInt(input.rut)
      const rutDigito = input.rutDigito
      const rut = accounting.formatNumber(rutParteA, 0, '.') + '-' + rutDigito
      data = { rut }
    }
    const datos = {
      id,
      data,
      tipo
    }
    await axios.put(ENDPOINT.dato, { datos }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => {
      console.log(r)
      if (r.status === 200) {
        notifyXpress('dato modificado con exito')
        handleCloseNnaChange()
        getProfesionalData()
      }
    })
  }
  const onSubmitChangeAdult = async (input) => {
    const id = selectId
    let data = input
    if (tipo === 18) {
      const rutParteA = parseInt(input.rut)
      const rutDigito = input.rutDigito
      const rut = accounting.formatNumber(rutParteA, 0, '.') + '-' + rutDigito
      data = { rut }
    }
    const datos = {
      id,
      data,
      tipo
    }
    await axios.put(ENDPOINT.adulto, { datos }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => {
      if (r.data) {
        notifyXpress('dato modificado con exito')
        handleCloseAdultChange()
      }
    })
  }

  const okButton = async () => {
    await putData(selectId).then((result) => {
      if (result) {
        notify(selectNna, getProfesional.nombre)
        setSelectId(null)
        setSelectNna(null)
        getProfesionalData()
      }
    })
    handleClose()
  }

  // CRUD
  const postAdulto = async (data) => await axios.post(ENDPOINT.adulto, { data }, {
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
  const postNna = async (datos) => await axios.post(ENDPOINT.nna, { datos }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((r) => {
    if (r.data) {
      notifyIngreso(datos.nombre)
      handleCloseNna()
    }
  })
  const postAnalisis = async (id, date, resumen, url) => await axios.put(ENDPOINT.resumen, { id, date, resumen, url }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((r) => {
    if (r.data) {
      notifyXpress('Análisis ingresado')
      notifyXpress('Análisis ingresado')
      handleClose()
    } else alert(`Error: ${r.data.message}`)
  }).catch((error) => console.error(error))

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

  const putData = async (id) => await axios.put(ENDPOINT.admin, { id }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((r) => {
    if (r.data) {
      notifyXpress('Listo')
    } else alert(`Error: ${r.data.message}`)
    return true
  }).catch((error) => console.error(error))

  const getDataForI = async (id, rol) => {
    const params = { id }
    let endpoint = null
    if (rol === 3) endpoint = ENDPOINT.formatos
    else endpoint = ENDPOINT.data
    await axios.get(endpoint, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setIsLoadData(false)
        setDataNna(result.data)
        console.log(result.data)
      })
      .catch((error) => {
        setIsLoadData(false)
        console.error(error)
      })
  }
  const getLogros = async (id) => {
    const params = { id }

    await axios.get(ENDPOINT.dato, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setHonor(result.data)
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
  }
  const getLogro = async (id) => {
    const params = { id }

    await axios.get(ENDPOINT.logros, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setHonor(result.data)
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
  }
  const getProfesionales = async (id) => {
    const params = { id }
    await axios.get(ENDPOINT.adulto, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setPersonas(result.data)
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
  }
  const onSubmitLogros = async (input) => {
    const datos = {
      id: input.id,
      logro: input.logro,
      medalla: input.medalla,
      contenido: input.contenido
    }

    await axios.post(ENDPOINT.logros, { datos }, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        if (result.data) notifyXpress('logro subido')
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
    setShowLogros(false)
  }
  const handleNewCenter = async (input) => {
    let resultado = null
    await axios.post(ENDPOINT.center, { input }, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        if (result.data) notifyXpress('centro ingresado')
        resultado = result.data
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
    return resultado
  }
  const handleNewCenterE = async (input) => {
    let resultado = null
    await axios.post(ENDPOINT.education, { input }, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        if (result.data) notifyXpress('Escuela ingresada')
        resultado = result.data
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
    return resultado
  }
  const deleteLogro = async (id) => {
    const params = { id }

    await axios.delete(ENDPOINT.logros, { params, headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        if (result.data) notifyXpress('logro borrado')
      })
      .catch((error) => {
        console.log(error)
        console.error(error)
      })
  }
  const getProfesionalData = async () => {
    setIsLoading(true)
    await axios.get(ENDPOINT.admin, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((result) => {
      setProfesional(result.data)
      setIsLoading(false)
      setSesion(true)
    }).catch((error) => {
      console.error(error)
      window.sessionStorage.removeItem('token')
      setProfesional(null)
      setSesion(false)
      navigate('/')
    }
    )
  }
  return {
    handleClose,
    handleShow,
    handleShowAdult,
    handleShowNna,
    handleCloseNna,
    handleCloseNnaChange,
    handleCloseChange,
    handleCloseFormato,
    handleCloseAdult,
    handleCloseAdultChange,
    handleShowFormato,
    handleClick,
    handleClickFormato,
    handleAdult,
    handleAddNNa,
    onSubmitAdulto,
    onSubmitChange,
    onSubmitNna,
    okButton,
    getProfesionalData,
    postAnalisis,
    onSubmitAnalisis,
    onSubmitChangeNna,
    onSubmitChangeAdult,
    getListas,
    getLogros,
    getLogro,
    deleteLogro,
    onSubmitLogros,
    getProfesionales,
    handleCloseLogro,
    palancaTareaCompletada,
    getTareas,
    deleteTarea,
    getTareasAdmin,
    onSubmitTareas,
    handleCloseTareas,
    activar: palancaActivarTarea,
    handleNewCenter,
    handleNewCenterE
  }
}

export default useHandle
