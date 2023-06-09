import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import { marked } from "marked";
import { useEffect, useRef } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const Laberinto = () => {
  const serverAddress = "wss://aia-remote-websocket-server.glitch.me/";
  //Dirección de servidor de Websocket
  const ws = new WebSocket(serverAddress);
  // Inicio de comunicación con Websocket
  ws.onopen = function () {
    ws.send("Soy el lab");
    GetAllDataOnce();
  };
  var username = "";
  /*
  Función de enviar parámetros
  Revisa si los parámetros a enviar tienen el formato adecuado y si cumplen con el rango esperado
  Si cumplen, se envían como texto separados por coma a través de websocket y se inicializa un 
  temporizador, indicando el tiempo máximo que podría esperar el usuario antes de recibir una respuesta del 
  computador del AIA.
  Si los parámetros no tienen el formato esperado, se indica al usuario que debe solucionar el error.
  */
  function enviarParametros() {
    var p1 = parseFloat(document.getElementById("parametro1").value);
    var p2 = parseFloat(document.getElementById("parametro2").value);
    var p3 = parseFloat(document.getElementById("parametro3").value);
    username = document.getElementById("parametro4").value.toString();
    if (isNaN(p1) || isNaN(p2) || isNaN(p3)) {
      document.getElementById("error").innerHTML =
        "Asegúrate de poner un número";
    } else if (p3 % 1 !== 0) {
      document.getElementById("error").innerHTML =
        "El Número de iteraciones debe ser entero";
    } else if (p1 < 0 || p1 > 1) {
      document.getElementById("error").innerHTML =
        "El gamma debe encontrarse entre 0 y 1";
    } else if (p2 < 0 || p2 > 1) {
      document.getElementById("error").innerHTML =
        "La tasa de aprendizaje debe encontrarse entre 0 y 1";
    } else if (p3 < 0 || p3 > 1500) {
      document.getElementById("error").innerHTML =
        "El número de iteraciones debe encontrarse entre 0 y 1500";
    } else if (username.trim().length === 0) {
      document.getElementById("error").innerHTML =
        "El nombre de usuario no puede estar vacío";
    } else {
      document.getElementById("error").innerHTML = "";
      var parametros =
        "Parametros:" +
        document.getElementById("parametro1").value +
        "," +
        document.getElementById("parametro2").value +
        "," +
        document.getElementById("parametro3").value;
      console.log(parametros);
      document.getElementById("btnEnviarParams").disabled = true;
      document.getElementById("txtResultado").innerHTML =
        "Esperando que se resuelva el modelo con los parámetros indicados, el límite de tiempo es 5 minutos";

      var countDownDate = new Date().getTime() + 5 * 60000;
      var x = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        document.getElementById("timer").innerHTML =
          minutes + "m " + seconds + "s ";

        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval(x);
          document.getElementById("timer").innerHTML = "EXPIRED";
        }
      }, 1000);

      if (ws.readyState === 1) {
        ws.send(parametros);
        console.log("se mando");
      } else {
        console.log("se mamo", ws.readyState);
        const ws = new WebSocket(serverAddress);
      }
    }
  }

  /*
  Recepción de mensajes mediante websocket.
  Puede recibir mensajes que comiencen por Tiempo, cuando se haya encontrado una solución, o Excedio,
  cuando los parámetros enviados no hayan convergido en una solución en menos de 5 minutos.
  */
  ws.onmessage = function (msg) {
    if (msg.data.toString().startsWith("Tiempo")) {
      console.log(msg.data);
      var array = msg.data.toString().split(":");
      var a = document.createElement("a");
      a.setAttribute(
        "href",
        "https://forms.office.com/Pages/ResponsePage.aspx?id=fAS9-kj_KkmLu4-YufucylyjiPt5ZQJHhoyI2uMf7Q9UQk1YQzZYTVVUSE0xQVJHQVZIVzlYNUJaSyQlQCNjPTEu"
      );
      a.innerHTML = "Link de forms";
      a.setAttribute("target", "_blank");
      document.getElementById("divForms").appendChild(a);
      document.getElementById("txtResultado").innerHTML =
        "El modelo encontró una solución en " +
        array[1] +
        ", llena el forms con este resultado y pulsa el botón para ver la solución en vivo";
      document.getElementById("timer").style.display = "none";
      document.getElementById("btnVerEnVivo").disabled = false;
      var tiempo = parseFloat(array[1].split(" ")[0]);
      console.log(tiempo, "tiempo");
      setDoc(doc(db, "scores", username), {
        time: tiempo,
        user: username,
      });
      GetAllDataOnce();
    } else if (msg.data.toString().startsWith("Excedio")) {
      console.log(msg.data);
      document.getElementById("txtResultado").innerHTML =
        "El modelo se excedió en el tiempo de respuesta y no encontró solución";
      document.getElementById("timer").style.display = "none";
      document.getElementById("btnVerEnVivo").disabled = true;
    }
  };

  /*
  Funcion que envía la orden de ejecutar el brazo mecánico al encontrar una solución al laberinto. 
  */
  function ejecutarRobot() {
    console.log("ejecutar");
    if (ws.readyState === 1) {
      ws.send("Ejecutar");
      console.log("se mando ejecucion");
    } else {
      console.log("se mamo ejecucion", ws.readyState);
      const ws = new WebSocket(serverAddress);
    }
  }

  /*
  Tabla que contiene resultados registrados de los usuarios.
  */
  function Tabla() {
    return (
      <div className="table-wrapper-scroll-y my-custom-scrollbar">
        <table id="myTable" className="table">
          <thead>
            <tr>
              <th>Top</th>
              <th>Tiempo (Segundos)</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody id="tbody1">
            <tr>
              <td>1</td>
              <td>¡Tiempo record!</td>
              <td>¡Tu nombre puede estar aqui!</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  //Funcion que añade un item a la tabla de resultados.
  function addItemToTable(user, time) {
    var table = document.getElementById("myTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "1";
    cell2.innerHTML = time;
    cell3.innerHTML = user;
  }

  // Funcion que añade todos los items de la base de datos a la tabla de resultados.
  function addAllItems(score) {
    document.getElementById("tbody1").innerHTML = "";
    score.forEach((element) => {
      console.log("metido" + element.user + element.time);
      addItemToTable(element.user, element.time);
    });
    console.log("metido");
    sortTable();
    var rows = document.getElementById("myTable").rows;
    for (var i = 1; i < rows.length; i++) {
      rows[i].cells[0].innerHTML = i;
    }
  }

  // Funcion que ordena la tabla de resultados.
  function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("myTable");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < rows.length - 1; i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("td")[1];
        y = rows[i + 1].getElementsByTagName("td")[1];
        //check if the two rows should switch place:
        if (Number(x.innerHTML) > Number(y.innerHTML)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

  //Configuraciones de firebase.
  const firebaseConfig = {
    apiKey: "AIzaSyD69L-Gjxkr70Rv9AP8-njeV4QOo2nRvRU",
    authDomain: "aiauniandes.firebaseapp.com",
    databaseURL: "https://aiauniandes-default-rtdb.firebaseio.com",
    projectId: "aiauniandes",
    storageBucket: "aiauniandes.appspot.com",
    messagingSenderId: "1093201810136",
    appId: "1:1093201810136:web:7309c2fca47a7990c17dad",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore();

  //Funcion que obtiene todos los datos de la base de datos.
  async function GetAllDataOnce() {
    const querySnapshot = await getDocs(collection(db, "scores"));

    var scores = [];

    querySnapshot.forEach((doc) => {
      scores.push(doc.data());
    });
    console.log("veces");
    addAllItems(scores);
  }

  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="row mt">
            <div className="col-6 tituloSnippet">Parámetros a modificar:</div>
            <div className="col-6 parametros">
              <form>
                <div className="form-group">
                  <label htmlFor="parametro1">
                    Gamma (0 a 1, punto decimal)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="parametro1"
                    placeholder="Ingresar valor de gamma"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="parametro2">
                    Tasa de Aprendizaje (0 a 1, punto decimal)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="parametro2"
                    placeholder="Ingresar taza de aprendizaje"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="parametro3">
                    Número de iteraciones (Máximo 1500)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="parametro3"
                    placeholder="Ingresar número de iteraciones deseadas"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="parametro4">Usuario uniandes</label>
                  <input
                    type="text"
                    className="form-control"
                    id="parametro4"
                    placeholder="Ingresar usuario uniandes (sin @uniandes.edu.co)"
                  />
                </div>
                <div className="errorMessage" id="error">
                  {" "}
                </div>
                <button
                  type="button"
                  id="btnEnviarParams"
                  onClick={enviarParametros}
                  className="btn btn-primary mt-2 btnComprobar"
                >
                  Comprobar
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="row tituloSnippet2">
            Laberinto usado para el ejercicio:
          </div>
          <div className="row align-center">
            <img
              src="pyamaze.jpg"
              className="imagenMaze"
              alt="Imagen Pyamaze"
            />
          </div>
          <div className="row">
            <div className="col-12 resultado" id="txtResultado"></div>
            <div id="timer" className="timer">
              {" "}
            </div>
            <div id="divForms"></div>
            <div className="col-4 btnVer">
              <form
                action="https://twitch.tv/aia_industrial"
                target="_blank"
                onClick={ejecutarRobot}
              >
                <button
                  type="submit"
                  width="100px"
                  className="btn btn-primary mt-2 btnVer"
                  id="btnVerEnVivo"
                  disabled={true}
                >
                  Ver ejecución en vivo
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="tituloTabla">Ranking con resultados:</div>
        </div>
        <Tabla />
      </div>
    </>
  );
};

export default Laberinto;
