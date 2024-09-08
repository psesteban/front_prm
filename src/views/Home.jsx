import { useEffect, useContext } from 'react'
import Context from '../contexts/context.js'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const {
    sesion
  } = useContext(Context)

  const token = window.sessionStorage.getItem('token')
  const rol = window.sessionStorage.getItem('sesionprm')

  useEffect(() => {
    if (sesion) {
      if (token) {
        if (rol === '3') {
          navigate('/admin')
        } else {
          navigate('/perfil')
        }
      }
    }
  }, [])

  return (
    <div className='py-5'>
      <h1>
        Hola soy tu <span className='fw-bold'>Ayudante</span>
      </h1>
      <h4>
        Organización de informes y otros
      </h4>
      <h6>PRM Buin-Paine I</h6>
    </div>
  )
}

export default Home
