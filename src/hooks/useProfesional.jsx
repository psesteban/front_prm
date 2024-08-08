import { useState } from 'react'

const useProfesional = () => {
  const [user, setUser] = useState(null)
  const [atrasos, setAtrasos] = useState([])
  const [pendientes, setPendientes] = useState([])
  const [totalCasos, setTotalCasos] = useState(0)
  const [atrasoTotal, setAtrasoTotal] = useState(0)
  const [pendienteTotal, setPendienteTotal] = useState(0)

  const fechaEntrega = (fecha, quarters) => {
    const date = new Date(fecha)
    const totalMonths = quarters * 3
    const newMonth = date.getMonth() + totalMonths
    const newDate = new Date(date.setMonth(newMonth))
    return newDate
  }

  const filterAtrasos = () => {
    const casos = user.casos
    const updatedCasos = Array.isArray(casos)
      ? user.casos.map(caso => ({
        ...caso,
        fechaInformePendiente: fechaEntrega(caso.fecha, caso.informe)
      }))
      : []
    const today = new Date()
    const todayMonth = today.getMonth()

    const filteredCasos = updatedCasos.filter(caso => {
      const { fechaInformePendiente } = caso
      return fechaInformePendiente < today
    })
    const enOrdenAtrasos = filteredCasos.sort((a, b) => a.fechaInformePendiente - b.fechaInformePendiente)
    const updatedFormatFechas = enOrdenAtrasos.map(caso => ({
      ...caso,
      fechaInformePendiente: (caso.fechaInformePendiente).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }))
    setAtrasos(updatedFormatFechas)

    const filteredCasosMes = updatedCasos.filter(caso => {
      const { fechaInformePendiente } = caso
      return fechaInformePendiente > today && fechaInformePendiente.getMonth() === todayMonth
    })
    const enOrdenPendientes = filteredCasosMes.sort((a, b) => a.fechaInformePendiente - b.fechaInformePendiente)

    const updatedFormatMes = enOrdenPendientes.map(caso => ({
      ...caso,
      fechaInformePendiente: (caso.fechaInformePendiente).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }))
    setPendientes(updatedFormatMes)
    if (totalCasos === 0) {
      setTotalCasos(updatedCasos.length)
    } else if (atrasoTotal === 0) {
      setAtrasoTotal(atrasos.length)
      setPendienteTotal(pendientes.length)
    }
  }

  const setFiltradosPendientes = (tratante) => {
    if (pendientes.length > 0) {
      const filtro = pendientes.filter(caso => {
        const { profesional } = caso
        return profesional === tratante
      })
      setPendientes(filtro)
    }
  }

  const setFiltradosAtrasos = (tratante) => {
    if (atrasos.length > 0) {
      const filtro = atrasos.filter(caso => {
        const { profesional } = caso
        return profesional === tratante
      })
      setAtrasos(filtro)
    }
  }
  const orderDataByName = (casos) => {
    const sortedData = casos.sort((a, b) => {
      const nameA = a.nombre.toLowerCase()
      const nameB = b.nombre.toLowerCase()
      if (nameA < nameB) {
        return -1
      } else if (nameA > nameB) {
        return 1
      } else {
        return 0
      }
    })
    return sortedData
  }

  const setProfesional = (profesional) => setUser(profesional)
  return {
    getProfesional: user,
    setProfesional,
    fechaEntrega,
    filterAtrasos,
    getAtrasos: atrasos,
    getPendientes: pendientes,
    atrasosFiltrados: setFiltradosAtrasos,
    pendientesFiltrados: setFiltradosPendientes,
    orderDataByName,
    totalCasos,
    atrasoTotal,
    pendienteTotal
  }
}

export default useProfesional
