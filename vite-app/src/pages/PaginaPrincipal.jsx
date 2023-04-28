import { NavLink } from "react-router-dom"
import Navbar from "../components/Navbar"

const PaginaPrincipal = () => {
  return (<>
    <div>
      <div className="row">
        <div className="titulo"> Laboratorio Digital AIA</div>
      </div>
      <div className="row justify-content-center">
        <div className=" col-6 contenidoPrincipal">
          ¡Bienvenidxs! Este es el laboratorio digital de AIA. Laboratorio de la universidad de los Andes que busca resolver problemas de optimización usando Machine learning.
          A continuación encuentras los diferentes ambientes disponibles, en los que puedes aplicar aprendizaje por refuerzo para resolver problemas específicos.
        </div>
      </div>
      <div className="row">
        <div className="ambientes">Ambientes</div>
      </div>
      <div className="row mt-4">

        <div className="col-12 col-md-6 col-lg-3 mx-auto">
          <div className="row align-center">
            <img src="laberinto.jpg" className="imagenAmb" alt="Imagen Laberinto" />
          </div>
          <div className="row">
            <div className="tituloAmb"> 1. Laberinto</div>
          </div>
          <div className="row">
          <NavLink to="/laberintoAIA" state="Laberinto AIA">
            <button className="btn btn-default">
              <img src="right.png" className="btnIr"/>
            </button>
            </NavLink>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="row align-center">
            <img src="bodega.png" className="imagenAmb" alt="Imagen Laberinto" />
          </div>
          <div className="row">
            <div className="tituloAmb"> 2. Bodegas Inteligentes</div>
          </div>
          <div className="row">
          <NavLink to="/bodegasInteligentes" state="Bodegas Inteligentes">
            <button className="btn btn-default">
              <img src="right.png" className="btnIr"/>
            </button>
            </NavLink>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 mx-auto">
          <div className="row align-center">
            <img src="brazo.png" className="imagenAmb" alt="Imagen Laberinto" />
          </div>
          <div className="row">
            <div className="tituloAmb"> 3. Brazo Interactivo</div>
          </div>
          <div className="row">
          <NavLink to="/brazoInteractivo" state="Brazo Interactivo">
            <button className="btn btn-default">
              <img src="right.png" className="btnIr"/>
            </button>
            </NavLink>
          </div>
        </div>


      </div>
    </div>
    </>
  )
}

export default PaginaPrincipal