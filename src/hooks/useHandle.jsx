import { useContext } from 'react'
import Context from '../contexts/context.js'

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
    getListas,
    getDataForI
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
    handleAddNNa
  }
}

export default useHandle
