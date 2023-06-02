import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/main.scss';
import PaginaPrincipal from './pages/PaginaPrincipal'
import Laberinto from './pages/Laberinto'
import BodegasInteligentes from './pages/BodegasInteligentes';

import { Route, Routes } from 'react-router-dom'
import BrazoInteractivo from './pages/BrazoInteractivo';
import Navbar from './components/Navbar';


function App() {
  const [count, setCount] = useState(0)

  return
  // Rutas determinadas para la navegación dentro de la página, todos los ambientes deben tener su propia ruta.
  <>
    <Navbar></Navbar>

    <Routes>
      <Route path="/" element={<PaginaPrincipal />} />
      <Route path="/laberintoAIA" element={<Laberinto />} />
      <Route path="/bodegasInteligentes" element={<BodegasInteligentes />} />
      <Route path="/brazoInteractivo" element={<BrazoInteractivo />} />
    </Routes>
    <br />© 2023 Universidad de los Andes - Bogotá, Colombia
  </>


}

export default App
