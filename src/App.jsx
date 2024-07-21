import './App.css'
import Context from './contexts/context.js'
import useProfesional from './hooks/useProfesional.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navigation from './components/Navigation.jsx'
import Home from './views/Home.jsx'
import Login from './views/Login.jsx'
import Profile from './views/Profile.jsx'
import Informes from './views/Informes.jsx'
import Admin from './views/Admin.jsx'
import LoginAdmin from './views/LoginAdmin.jsx'

const App = () => {
  const globalState = useProfesional()

  return (
    <Context.Provider value={globalState}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/perfil' element={<Profile />} />
          <Route path='/total' element={<Informes />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/login_admin' element={<LoginAdmin />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App
