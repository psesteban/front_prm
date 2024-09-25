import './App.css'
import Context from './contexts/context.js'
import useProfesional from './hooks/useProfesional.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navigation from './components/Navigation.jsx'
import Home from './views/Home.jsx'
import Profile from './views/Profile.jsx'
import Informes from './views/Informes.jsx'
import Admin from './views/Admin.jsx'
import Analisis from './views/Analisis.jsx'
import Casos from './views/Casos.jsx'
import Logros from './views/Logros.jsx'
import Editar from './views/Editar.jsx'
import NotFound from './views/NotFound.jsx'

const App = () => {
  const globalState = useProfesional()

  return (

    <BrowserRouter>
      <Context.Provider value={globalState}>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/perfil' element={<Profile />} />
          <Route path='/total' element={<Informes />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/analisis' element={<Analisis />} />
          <Route path='/editar' element={<Editar />} />
          <Route path='/logros' element={<Logros />} />
          <Route path='/casos' element={<Casos />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </Context.Provider>
    </BrowserRouter>

  )
}

export default App
