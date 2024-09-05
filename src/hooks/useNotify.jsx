import { toast } from 'react-toastify'

const useNotify = () => {
// mensaje felicidades al clickear termino de informe
  const notify = (idNna, profesional) => {
    const mensaje = `felicidades ${profesional} informe de ${idNna} 💝revisado y enviado`
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
    theme: 'light'
  })

  const notifyXpress = (mensaje) => toast.success(mensaje, {
    position: 'top-left',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark'
  })

  return {
    notifyIngreso,
    notify,
    notifyXpress
  }
}

export default useNotify
