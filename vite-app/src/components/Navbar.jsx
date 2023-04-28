import { Link, NavLink, useLocation } from "react-router-dom"


const Navbar = () => {
  const location = (useLocation().state === null ? "Laboratorio AIA" : useLocation().state)
  return (

    <div className="row">
      <nav className="navbar col-12">
        <div className="container-fluid row">
          <div className="col-4 logoUniandes">
            <img src="uniandeslogo.svg" height="100px" className="logoUniandes" alt="Uniandes logo" />
          </div>
          <div className="col-4 tituloPagina">
            {location}
          </div>
          <div className="col-4 inicio">
            <NavLink to="/" className="inicio">Inicio</NavLink>
          </div>
        </div>
      </nav>
    </div>

  )
}

export default Navbar