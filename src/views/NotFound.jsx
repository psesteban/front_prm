import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className='not-found'>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <button> <Link to='/'>Volver a la página principal</Link></button>
    </div>
  )
}

export default NotFound
