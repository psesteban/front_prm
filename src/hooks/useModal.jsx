import { useState } from 'react'

const useModal = () => {
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

  return {
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
    setNombreProfesional
  }
}

export default useModal
