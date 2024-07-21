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

    <BrowserRouter>
      <Context.Provider value={globalState}>
        <Navigation />
        <Routes>
          <Route path='prmbuin.netlify.app/' element={<Home />} />
          <Route path='prmbuin.netlify.app/login' element={<Login />} />
          <Route path='prmbuin.netlify.app/perfil' element={<Profile />} />
          <Route path='prmbuin.netlify.app/total' element={<Informes />} />
          <Route path='prmbuin.netlify.app/admin' element={<Admin />} />
          <Route path='prmbuin.netlify.app/login_admin' element={<LoginAdmin />} />
        </Routes>
        <ToastContainer />
      </Context.Provider>
    </BrowserRouter>

  )
}

export default App
