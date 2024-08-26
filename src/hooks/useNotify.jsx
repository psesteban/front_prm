import { toast } from 'react-toastify'

const useNotify = () => {
// mensaje felicidades al clickear termino de informe
  const notify = (idNna, profesional, rol) => {
    let mensaje = 'felicidades, esta listo'
    if (rol === 'usuario') mensaje = `felicidades ${profesional} terminaste tu parte del informe de ${idNna} 💝`
    else if (rol === 'admin') mensaje = `felicidades ${profesional} informe de ${idNna} 💝revisado y enviado`
    toast.success(mensaje, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }
  const notifyIngreso = (nombre) => toast.success(` ${nombre} ha ingresado con éxito`, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark'
  })

  return {
    notifyIngreso,
    notify
  }
}

export default useNotify
