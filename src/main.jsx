import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Context from './contexts/context.js'
import './index.css'
import useProfesional from './hooks/useProfesional.jsx'

const globalState = useProfesional()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Context.Provider value={globalState}>
    <App />
  </Context.Provider>
)
