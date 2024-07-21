import { useState } from 'react'

const useProfesional = () => {
  const [user, setUser] = useState(null)
  const [casos, setCasos] = useState([])
  const [atrasos, setAtrasos] = useState([])
  const [pendientes, setPendientes] = useState([])

  const fechaEntrega = (fecha, quarters) => {
    const date = new Date(fecha)
    const newYear = date.getFullYear() + Math.floor(quarters / 4)
    const newQuarter = (date.getMonth() + 1) + (quarters % 4) * 3
    const newMonth = (newQuarter - 1) % 12
    const newMonthDay = Math.min(date.getDate(), new Date(newYear, newMonth + 1, 0).getDate())
    const newDate = new Date(newYear, newMonth, newMonthDay)
    return newDate
  }

  const filterAtrasos = () => {
    const updatedCasos = Array.isArray(casos)
      ? casos.map(caso => ({
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
    const updatedFormatFechas = filteredCasos.map(caso => ({
      ...caso,
      fechaInformePendiente: (caso.fechaInformePendiente).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }))
    setAtrasos(updatedFormatFechas)

    const filteredCasosMes = updatedCasos.filter(caso => {
      const { fechaInformePendiente } = caso
      return fechaInformePendiente > today && fechaInformePendiente.getMonth() === todayMonth
    })
    const updatedFormatMes = filteredCasosMes.map(caso => ({
      ...caso,
      fechaInformePendiente: (caso.fechaInformePendiente).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }))
    setPendientes(updatedFormatMes)
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
  const setData = (casos) => {
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
    setCasos(sortedData)
  }

  const setProfesional = (profesional) => setUser(profesional)
  const updateCasos = (casos) => setCasos(casos)
  return {
    getProfesional: user,
    setProfesional,
    fechaEntrega,
    filterAtrasos,
    getAtrasos: atrasos,
    getPendientes: pendientes,
    atrasosFiltrados: setFiltradosAtrasos,
    pendientesFiltrados: setFiltradosPendientes,
    setData,
    casos,
    updateCasos
  }
}

export default useProfesional
