import { useState } from 'react'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

const useProfesional = () => {
  const [user, setUser] = useState(null)
  const [atrasos, setAtrasos] = useState([])
  const [pendientes, setPendientes] = useState([])
  const [totalCasos, setTotalCasos] = useState(0)
  const [dataNna, setDataNna] = useState(null)
  const [duplas, setDuplas] = useState(['duplas'])
  const [isLoading, setIsLoading] = useState(false)
  const [tipo, setTipo] = useState(0)
  const [sesion, setSesion] = useState(true)

  // modal
  const [listas, setListas] = useState(null)
  const [show, setShow] = useState(false)
  const [showFormato, setShowFormato] = useState(false)
  const [showAdult, setShowAdult] = useState(false)
  const [showNna, setShowNna] = useState(false)
  const [showNewAd, setShowNewAd] = useState(false)
  const [litleCharge, setLitleCharge] = useState(false)
  const [isLoadData, setIsLoadData] = useState(false)
  const [selectId, setSelectId] = useState(null)
  const [selectNna, setSelectNna] = useState(null)
  const [addNna, setAddNna] = useState(true)
  const [nombreProfesional, setNombreProfesional] = useState({ nombre: 'profesional', rol: 'profesional', dupla: 'colega' })
  const [showNnaChange, setShowNnaChange] = useState(null)
  const [showAdultChange, setShowAdultChange] = useState(null)
  const [showLogros, setShowLogros] = useState(null)
  const [personas, setPersonas] = useState(null)
  const [honor, setHonor] = useState(null)

  const calcularEdad = (fechaNacimiento) => {
    const fechaNacimientoObj = new Date(fechaNacimiento)
    const hoy = new Date()
    // Calcular la diferencia en milisegundos
    const diferenciaEnMS = hoy - fechaNacimientoObj
    // Convertir la diferencia a años (aproximado)
    const edadEnAnos = Math.floor(diferenciaEnMS / (1000 * 60 * 60 * 24 * 365.25))
    const edad = `${edadEnAnos} años`
    return edad
  }
  const permanencia = (ingreso) => {
    const fechaIngreso = new Date(ingreso)
    const hoy = new Date()

    const yearDiff = hoy.getFullYear() - fechaIngreso.getFullYear()
    const monthDiff = hoy.getMonth() - fechaIngreso.getMonth()

    // Calcular los meses totales considerando años y meses.
    const meses = yearDiff * 12 + monthDiff

    const tiempo = `${meses} meses`
    return tiempo
  }
  const calculaEgreso = (fechaIngreso) => {
    const fecha = new Date(fechaIngreso)
    // Obtener los componentes individuales de la fecha
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const year = fecha.getFullYear() + 1
    const fechaChilena = `${dia}-${mes}-${year}`
    return fechaChilena
  }
  const generateWordDocument = (tipo, rol, nombre, dupla) => {
    const nna = dataNna[0]
    const nombrePropio = nna.nombre
    const separado = nombrePropio.split(' ')
    const apellidoMaterno = separado.pop()
    const apellidoPaterno = separado.pop()
    const nombres = separado.join(' ')
    const ingreso = new Date(nna.ingreso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    const fechaNacimiento = new Date(nna.nac).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    const edadNna = calcularEdad(nna.nac)
    const egreso = calculaEgreso(nna.ingreso)
    const hoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    let tratante = 'psicologa'
    let ts = 'trabajadora social'
    if (rol === 1) {
      tratante = nombre
      ts = dupla
    } else if (rol === 2) {
      tratante = dupla
      ts = nombre
    } else {
      console.log(`Ingreso de asesor: ${tratante} PS, ${ts} TS`)
    }
    if (tipo === 1) {
      fetch('/templates/PII_Diag.docx')
        .then(response => response.arrayBuffer())
        .then(content => {
          const zip = new PizZip(content)
          const doc = new Docxtemplater().loadZip(zip)
          const vencimiento = fechaEntrega(nna.ingreso, 1).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          const context = {
            el_nombre: nombres,
            el_apellido_p: apellidoPaterno,
            el_apellido_m: apellidoMaterno,
            f_PII: ingreso,
            ft_PII: vencimiento,
            f_nac: fechaNacimiento,
            edad: edadNna,
            sexo: nna.gen,
            nombre_ad: nna.responsable,
            fam: nna.parentesco,
            motiv: nna.motivo,
            f_egreso: egreso,
            f_ingreso: ingreso,
            n_psico: tratante,
            n_ts: ts
          }

          doc.setData(context)

          try {
            doc.render()
          } catch (error) {
            console.error('Error al generar el documento:', error)
            return
          }

          const out = doc.getZip().generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
          const filename = `PII_Diag_${nna.nombre}.docx`
          const link = document.createElement('a')
          link.href = URL.createObjectURL(out)
          link.download = filename
          // Adjuntar el enlace temporal al DOM, hacer clic en él y luego eliminarlo
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
    }
    if (tipo === 2) {
      fetch('/templates/PII.docx')
        .then(response => response.arrayBuffer())
        .then(content => {
          const zip = new PizZip(content)
          const doc = new Docxtemplater().loadZip(zip)
          const vencimiento = fechaEntrega(nna.ingreso, nna.numero).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          const context = {
            el_nombre: nombres,
            el_apellido_p: apellidoPaterno,
            el_apellido_m: apellidoMaterno,
            f_PII: ingreso,
            ft_PII: vencimiento,
            f_nac: fechaNacimiento,
            edad: edadNna,
            sexo: nna.gen,
            nombre_ad: nna.responsable,
            fam: nna.parentesco,
            motiv: nna.motivo,
            f_egreso: egreso,
            f_ingreso: ingreso,
            n_psico: tratante,
            n_ts: ts
          }

          doc.setData(context)

          try {
            doc.render()
          } catch (error) {
            console.error('Error al generar el documento:', error)
            return
          }

          const out = doc.getZip().generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
          const filename = `PII_${nna.nombre}.docx`
          const link = document.createElement('a')
          link.href = URL.createObjectURL(out)
          link.download = filename
          // Adjuntar el enlace temporal al DOM, hacer clic en él y luego eliminarlo
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
    }
    if (tipo === 3) {
      fetch('/templates/IPD.docx')
        .then(response => response.arrayBuffer())
        .then(content => {
          const zip = new PizZip(content)
          const doc = new Docxtemplater().loadZip(zip)
          const edadAdulto = calcularEdad(nna.nacimiento)

          const context = {
            el_nombre: nombres,
            el_apellido_p: apellidoPaterno,
            el_apellido_m: apellidoMaterno,
            fecha_hoy: hoy,
            f_ingreso: ingreso,
            f_nac: fechaNacimiento,
            edad: edadNna,
            sexo: nna.gen,
            nombre_ad: nna.responsable,
            fam: nna.parentesco,
            motiv: nna.motivo,
            Rit: nna.rit,
            Rut: nna.rut,
            nacion: nna.nacion,
            fam_edad: edadAdulto,
            fam_Rut: nna.run,
            fam_oc: nna.labores,
            domicilio: nna.domicilio,
            comuna: nna.comuna,
            fam_fono: nna.fono,
            curad: 'La niñez se Defiende',
            fam_nac: new Date(nna.nacimiento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            curso: nna.curso,
            est_ed: nna.ed,
            n_psico: tratante,
            n_ts: ts
          }

          doc.setData(context)

          try {
            doc.render()
          } catch (error) {
            console.error('Error al generar el documento:', error)
            return
          }

          const out = doc.getZip().generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
          const filename = `IPD_${nna.nombre}.docx`
          const link = document.createElement('a')
          link.href = URL.createObjectURL(out)
          link.download = filename
          // Adjuntar el enlace temporal al DOM, hacer clic en él y luego eliminarlo
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
    }
    if (tipo === 4) {
      fetch('/templates/IA.docx')
        .then(response => response.arrayBuffer())
        .then(content => {
          const zip = new PizZip(content)
          const doc = new Docxtemplater().loadZip(zip)
          const ultimoPii = fechaEntrega(nna.ingreso, nna.numero).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          const ipdPii = fechaEntrega(nna.ingreso, 1).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          const tiempoPRM = permanencia(nna.ingreso)
          const edadAdulto = calcularEdad(nna.nacimiento)
          const context = {
            el_nombre: nombres,
            el_apellido_p: apellidoPaterno,
            el_apellido_m: apellidoMaterno,
            fecha_hoy: hoy,
            f_PII: ultimoPii,
            f_PII_d: ipdPii,
            f_ingreso: ingreso,
            f_nac: fechaNacimiento,
            edad: edadNna,
            sexo: nna.gen,
            nombre_ad: nna.responsable,
            fam: nna.parentesco,
            motiv: nna.motivo,
            Rit: nna.rit,
            Rut: nna.rut,
            nacion: nna.nacion,
            fam_edad: edadAdulto,
            fam_Rut: nna.run,
            fam_oc: nna.labores,
            domicilio: nna.domicilio,
            comuna: nna.comuna,
            fam_fono: nna.fono,
            curad: 'La niñez se Defiende',
            fam_nac: new Date(nna.nacimiento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            curso: nna.curso,
            tiempo_prm: tiempoPRM,
            est_ed: nna.ed,
            est_salud: nna.salud,
            n_psico: tratante,
            n_ts: ts
          }

          doc.setData(context)

          try {
            doc.render()
          } catch (error) {
            console.error('Error al generar el documento:', error)
            return
          }

          const out = doc.getZip().generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
          const filename = `IA_${nna.nombre}.docx`
          const link = document.createElement('a')
          link.href = URL.createObjectURL(out)
          link.download = filename
          // Adjuntar el enlace temporal al DOM, hacer clic en él y luego eliminarlo
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
    }
    if (tipo === 5) {
      fetch('/templates/Prorroga.docx')
        .then(response => response.arrayBuffer())
        .then(content => {
          const zip = new PizZip(content)
          const doc = new Docxtemplater().loadZip(zip)
          const edadAdulto = calcularEdad(nna.nacimiento)
          const vencimiento = fechaEntrega(nna.ingreso, nna.numero).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          const context = {
            el_nombre: nombres,
            el_apellido_p: apellidoPaterno,
            el_apellido_m: apellidoMaterno,
            Rut: nna.rut,
            curso: nna.curso,
            domicilio: nna.domicilio,
            comuna: nna.comuna,
            Rit: nna.rit,
            ft_PII: vencimiento,
            f_nac: fechaNacimiento,
            edad: edadNna,
            sexo: nna.gen,
            nombre_ad: nna.responsable,
            fam: nna.parentesco,
            fam_edad: edadAdulto,
            fam_nac: new Date(nna.nacimiento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            fam_Rut: nna.run,
            motiv: nna.motivo,
            f_ingreso: ingreso,
            fam_fono: nna.fono
          }

          doc.setData(context)

          try {
            doc.render()
          } catch (error) {
            console.error('Error al generar el documento:', error)
            return
          }

          const out = doc.getZip().generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
          const filename = `Prorroga_${nna.nombre}.docx`
          const link = document.createElement('a')
          link.href = URL.createObjectURL(out)
          link.download = filename
          // Adjuntar el enlace temporal al DOM, hacer clic en él y luego eliminarlo
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
    }
  }

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

    const limitDate = new Date(today)
    limitDate.setDate(today.getDate() + 31)

    const filteredCasosMes = updatedCasos.filter(caso => {
      const { fechaInformePendiente } = caso
      return fechaInformePendiente > today &&
             fechaInformePendiente <= limitDate
    })
    const enOrdenPendientes = filteredCasosMes.sort((a, b) => a.fechaInformePendiente - b.fechaInformePendiente)

    const updatedFormatMes = enOrdenPendientes.map(caso => ({
      ...caso,
      fechaInformePendiente: (caso.fechaInformePendiente).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }))
    setPendientes(updatedFormatMes)
    if (totalCasos === 0) {
      setTotalCasos(updatedCasos.length)
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
  const formatoFecha = (fecha) => { return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) }

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
    totalCasos,
    generaWord: generateWordDocument,
    dataNna,
    setDataNna,
    duplas,
    setDuplas,
    listas,
    setListas,
    show,
    showFormato,
    showAdult,
    showNna,
    showNewAd,
    setShow,
    setShowFormato,
    setShowAdult,
    setShowNna,
    setShowNewAd,
    litleCharge,
    setLitleCharge,
    isLoadData,
    setIsLoadData,
    selectId,
    setSelectId,
    selectNna,
    setSelectNna,
    addNna,
    setAddNna,
    nombreProfesional,
    setNombreProfesional,
    isLoading,
    setIsLoading,
    tipo,
    setTipo,
    showNnaChange,
    setShowNnaChange,
    showAdultChange,
    setShowAdultChange,
    formatoFecha,
    honor,
    setHonor,
    showLogros,
    setShowLogros,
    personas,
    setPersonas,
    sesion,
    setSesion
  }
}

export default useProfesional
