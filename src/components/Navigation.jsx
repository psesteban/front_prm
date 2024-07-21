import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Context from '../contexts/context.js'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const Navigation = () => {
  const navigate = useNavigate()
  const { getProfesional, setProfesional } = useContext(Context)
  console.log(getProfesional)
  const logout = () => {
    setProfesional(null)
    window.sessionStorage.removeItem('token')
    navigate('/')
  }

  const isLogin = () => {
    if (!getProfesional) {
      return (
        <>
          <Button variant='info' href='/login'>Iniciar Sesión</Button>
          <Button variant='light' size='sm' href='/login_admin'>admin</Button>

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
