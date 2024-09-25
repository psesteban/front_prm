import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className='not-found'>
      <img src='../public/assets/notfound.webp' alt='Página no encontrada' />
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link to='/'>Volver a la página principal</Link>
    </div>
  )
}

export default NotFound
