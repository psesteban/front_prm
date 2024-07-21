import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Context from '../contexts/context.js'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const Navigation = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional } = useContext(Context)
  const logout = () => {
    setProfesional(null)
    window.sessionStorage.removeItem('token')
    navigate('/')
  }

  const isLogin = () => {
    if (!getProfesional) {
      return (
        <>
          <Link to='/login'>
            <Button variant='info'>Iniciar Sesión</Button>
          </Link>
          <Link to='/login_admin'>
            <Button variant='light' size='sm'>admin</Button>
          </Link>
        </>

      )
    }

    return (
      <>
        <Link to='/total' className='btn m-1 btn-light'>👧Total👦</Link>
        <Link className='btn m-1 btn-light' to={getProfesional.rol ? '/admin' : '/perfil'}>Resumen</Link>
        <button onClick={logout} className='btn btn-danger'>Salir</button>
      </>
    )
  }

  return (
    <nav className='navbar'>
      <span className='logo'>PRM</span>
      <div className='opciones'>
        {isLogin()}
      </div>
    </nav>
  )
}

export default Navigation
