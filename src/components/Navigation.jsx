import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Context from '../contexts/context.js'
import { Button, Container, Navbar } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Navigation.css'
import Logo from '../assets/logo.svg' // Assuming logo is an SVG

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
        <Link to='/total' className='btn m-1 btn-light'>Total</Link>
        <Link className='btn m-1 btn-light' to={getProfesional.rol ? '/admin' : '/perfil'}>Resumen</Link>
        <button onClick={logout} className='btn btn-danger'>Salir</button>
      </>
    )
  }

  return (
    <Navbar>
      <Container className='logo'>
        <Navbar.Brand href='#home'>
          <img
            alt='logo'
            src={Logo}
            width='40'
            height='40'
            className='d-inline-block align-top'
          />{' '}
        </Navbar.Brand>
        <Link className='navbar-brand' to='/' />
        <div className='opciones'>
          {isLogin()}
        </div>
      </Container>
    </Navbar>
  )
}

export default Navigation
