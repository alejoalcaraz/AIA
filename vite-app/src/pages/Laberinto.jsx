import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import { marked } from "marked";
import { useEffect, useRef } from "react";


const markdown = `
\`\`\`python
# #Se importan las librerías de interés
from Pyamaze import *
import numpy as np
import pandas as pd
import time
import matplotlib.pyplot as plt
import sys

def Qlearn(nombre="maze.csv", gamma = 0.8,tasa_aprendizaje = 0.5,iteraciones = 600):
    #Se carga el laberinto del archivo
    laberinto = maze()
    laberinto.CreateMaze(loadMaze='maze.csv')

    #Se importan las dimensiones del laberinto
    ancho = laberinto.cols
    largo = laberinto.rows


    #Se importan las coordenadas de la meta
    xMeta = laberinto._goal[0]
    yMeta = laberinto._goal[1]

    #Se inicializa el tiempo de corrida del programa
    tiempo_inicio = time.time()

    #Con este diccionario vemos en cada posición del laberinto si hay o no paredes
    #a los lados (0:tiene pared, 1: no tiene pared)
    paredes = laberinto.maze_map


    #Se crea y llena el diccionario de recompensas:
        #Cada movimiento tiene un retorno de -0.1
        #Si hay una pared en medio de un posible movimiento, se castiga
        #con una recompensa de -10000
        #Si ya se encuentra justo al lado de la meta, el retorno es de 10 si se decide
        #llegar a la meta

    #Se crea la lista de direcciones posibles (acciones)
    direcciones = ['E','W','N','S']
    #Se crea el diccionario de recompensas
    recompensas = {}

    #Se llena el diccionario de recompensas recorriendo todos los estados
    for i in paredes:
        #Se crea un sub diccionario en cada estado, el cual almacenará las posibles acciones
        #y sus recompensas
        recompensas[i] = {}
        #Se hace un recorrido de las direcciones y se asignan las respectivas recompensas
        for j in direcciones:
            if paredes[i][j] == 1:
                recompensas[i][j] = -0.1
            if paredes[i][j] == 0:
                recompensas[i][j] = -10000
        if i == (xMeta+1, yMeta) and paredes[i]['N'] != 0:
            recompensas[i]['N'] = 10
        if i == (xMeta-1, yMeta) and paredes[i]['S'] != 0:
            recompensas[i]['S'] = 10
        if i == (xMeta, yMeta+1) and paredes[i]['W'] != 0:
            recompensas[i]['W'] = 10
        if i == (xMeta, yMeta-1) and paredes[i]['E'] != 0:
            recompensas[i]['E'] = 10


    #Se crea una función que devuelve una lista de los posibles estados futuros
    #dado un estado inicial
    def proximos_estados(inicial, paredes):
        posiciones = []
        if paredes[inicial]['E'] == 1:
            posiciones.append((inicial[0],inicial[1]+1))
        if paredes[inicial]['W'] == 1:
            posiciones.append((inicial[0],inicial[1]-1))
        if paredes[inicial]['N'] == 1:
            posiciones.append((inicial[0]-1,inicial[1]))
        if paredes[inicial]['S'] == 1:
            posiciones.append((inicial[0]+1,inicial[1]))
        return posiciones

    #Se define una función que elija un estado futuro al azar a partir de los
    #posibles estados futuros
    def proximo_aleatorio(inicial, paredes):
        posibles_futuros = proximos_estados(inicial, paredes)
        estado_futuro = posibles_futuros[np.random.randint(0, len(posibles_futuros))]
        return estado_futuro

    #Se define una función que, dado un movimiento aleatorio, reporta qué dirección se tomó
    def movimiento_siguiente(inicial, futuro):
        direccion = ''
        if futuro[0] == inicial[0]+1:
            direccion = 'S'
        if futuro[0] == inicial[0]-1:
            direccion = 'N'
        if futuro[1] == inicial[1]+1:
            direccion = 'E'
        if futuro[1] == inicial[1]-1:
            direccion = 'W'
        return direccion


    #Se define una función que se encargue de llevar a cabo el entrenamiento del Q-Learning
    def entrenamiento(paredes, recompensas, Q, gamma, tasa_aprendizaje, meta, numero_estados, iteraciones):
        #Se crea una lista que almacenará la suma de la matriz Q en cada paso
        totalQ = []
        #Se inician la eploración del agente
        for i in range(0,iteraciones):
            #Se inicializa la exploración con un estado inicial aleatorio
            estado_actual = lista_estados[np.random.randint(0, numero_estados)]

            #El agente explora el laberinto desde donde comenzó hasta llegar a la meta
            while(True):
                #El agente se dirige a un estado futuro y explora a dónde más puede dirigirse
                estado_futuro = proximo_aleatorio(estado_actual,paredes)
                posibles_futuros_futuros = proximos_estados(estado_futuro,paredes)

                #Se inicializa el valor máximo del elemento de la matriz Q
                max_Q = -99999

                #Se recorren los psobiles estados futuros futuros del agente
                for j in range(len(posibles_futuros_futuros)):
                    #Se asigna el estado futuro futuro en donde se encontrará el agente
                    estado_futuro_futuro = posibles_futuros_futuros[j]
                    #Se almacena el valor actual de la matriz Q[S',S'']
                    q = Q[estado_futuro_futuro][estado_futuro]
                    #Si el valor de Q[S',S''] es mayor que el máximo obtenido hasta ahora
                    #se asigna ese valor como el nuevo máximo
                    if q > max_Q:
                        max_Q = q
                #Dado el estado inicial y el futuro, se consulta a cuál dirección corresponde
                direccion = movimiento_siguiente(estado_actual, estado_futuro)
                #Se actualiza el valor en la matriz Q con la expresión de Q-Learning
                Q[estado_futuro][estado_actual] = ((1-tasa_aprendizaje)*Q[estado_futuro][estado_actual]) + 
                    (tasa_aprendizaje*(recompensas[estado_actual][direccion] + 
                    (gamma*(max_Q-Q[estado_futuro][estado_actual]))))
                #El nuevo estado actual pasa a ser el estado en el que el agente se movió
                estado_actual = estado_futuro
                #Se calcula el tiempo de corrida del código hasta ahora.
                tiempo_actual = time.time()
                tiempo_parcial = tiempo_actual - tiempo_inicio
                #Si el tiempo de corrida es mayor al límite, se detiene el código
                if tiempo_parcial >= 300:
                    print("Se excedió el límite de tiempo (5 minutos)")
                    break
                #Si este nuevo estado es la meta, se acaba esta iteración
                if estado_actual == meta:
                    break
            #Al final de cada iteración se almacena en una lista la suma de la matriz Q parcial
            totalQ.append(Q.sum().sum())
        #Es de interés retornar la lista de la suma de la matriz para graficar 
        #la curva deaprendizaje
        return totalQ

    #Se crea una función que imprima los estados en los que debe estar el agente para llegar a
    #la meta
    def pasos(inicio, meta, Q):
        actual = inicio
        listaEstadosSol = []
        listaEstadosSol.append(actual)
        print(str(actual) + '->', end='')
        while actual != meta:
            siguiente = Q.idxmax(axis = 'columns')[actual]
            print(str(siguiente) + '->', end='')
            actual = siguiente
            listaEstadosSol.append(actual)
        print('¡Finalizado!')
        return(listaEstadosSol)


    print('\n')

    #Se pasa a resolver el problema del laberinto generado
    print('Analizando el laberinto con Q-learning...')

    #Se inicializan las posiciones de inicio y fin
    inicio = (ancho, largo)
    meta = (xMeta, yMeta)

    #Se obtiene una lista de estados de nuestro modelo
    lista_estados = []
    for i in paredes:
        lista_estados.append(i)

    #Se obtiene la cantidad total de estados
    numero_estados = len(lista_estados)

    #Se inicializa la matriz Q con valores de 0
    Q = np.zeros(shape = [len(lista_estados), len(lista_estados)], dtype = np.float32)

    #Se convierte la matriz Q en un DataFrame
    Q = pd.DataFrame(Q, columns=lista_estados, index= lista_estados)

    #Se corre el algoritmo de Q-Learning
    totalQ = entrenamiento(paredes, recompensas, Q, gamma, tasa_aprendizaje, 
                           meta, numero_estados, iteraciones)

    #AL final, se reemplazan los valores que hayan quedado como 0 (infactibles)
    #para que tomen un valor de -1000
    Q = Q.replace(0, -1000)

    print('¡Finalizado!')

    print('\n')

    #Se imprimen los resultados
    print('Usando Q para ir desde el inicio a la meta se debe hacer el siguiente recorrido:')
    listaEstadosSol = pasos(inicio, meta, Q)


    #Se crea la cadeba que indica las direcciones en las que se debe dirigir el agente
    strDireccionesSol = ''
    for i in range(len(listaEstadosSol)-1):
        if listaEstadosSol[i+1][0] == listaEstadosSol[i][0] + 1:
            strDireccionesSol+='SS'
        elif listaEstadosSol[i+1][0] == listaEstadosSol[i][0] - 1:
            strDireccionesSol+='WW'
        elif listaEstadosSol[i+1][1] == listaEstadosSol[i][1] + 1:
            strDireccionesSol+='DD'
        elif listaEstadosSol[i+1][1] == listaEstadosSol[i][1] - 1:
            strDireccionesSol+='AA'

    print('\n')

    #Se imprimen las direcciones en las que se debe dirigir el agente
    print('Las siguientes son las direcciones en las que se debe mover el agente empezando en', (ancho,largo))
    print(strDireccionesSol)
    print('¡Finalizado¡')

    #Se registra el tiempo de finalización del código
    tiempo_fin = time.time()

    #Se consulta el tiempo total requerido para resolver el problema
    tiempo_corrida = tiempo_fin-tiempo_inicio
    print('El tiempo de corrida fue de', round(tiempo_corrida, ndigits=2), 'segundos')

    #Se muestra el laberinto creado
    #laberinto.run()

    #Se grafica la curva de aprendizaje
    plt.plot([i for i in range(0,iteraciones)], totalQ)
    plt.xlabel('Paso')
    plt.ylabel('Suma matriz Q')
    plt.title(f'Suma matriz Q vs. Pasos, laberinto {ancho}x{largo}')
    plt.savefig('grafica.png')
    return strDireccionesSol,tiempo_corrida
if __name__ == "__main__":
    Qlearn(nombre='maze.csv')
\`\`\`
`;

const Laberinto = () => {

  useEffect(() => {
    hljs.highlightAll();
  });



  const serverAddress = 'wss://aia-remote-websocket-server.glitch.me/';

  const ws = new WebSocket(serverAddress);

  ws.onopen = function () {
    ws.send("Soy el lab");
  };


  function enviarParametros() {
    var p1 = parseFloat(document.getElementById('parametro1').value);
    var p2 = parseFloat(document.getElementById('parametro2').value);
    var p3 = parseFloat(document.getElementById('parametro3').value);
    if (isNaN(p1) || isNaN(p2) || isNaN(p3)) {
      document.getElementById('error').innerHTML = 'Asegúrate de poner un número';
    }
    else if (p3 % 1 !== 0) {
      document.getElementById('error').innerHTML = 'El Número de iteraciones debe ser entero';
    }
    else if (p1 < 0 || p1 > 1) {
      document.getElementById('error').innerHTML = 'El gamma debe encontrarse entre 0 y 1';
    }
    else if (p2 < 0 || p2 > 1) {
      document.getElementById('error').innerHTML = 'La tasa de aprendizaje debe encontrarse entre 0 y 1';
    }
    else if (p3 < 600 || p3 > 1500) {
      document.getElementById('error').innerHTML = 'El número de iteraciones debe encontrarse entre 600 y 1500';
    }
    else {
      document.getElementById('error').innerHTML = '';
      var parametros = 'Parametros:' + document.getElementById('parametro1').value + ',' + document.getElementById('parametro2').value + ',' + document.getElementById('parametro3').value;
      console.log(parametros);
      document.getElementById('btnEnviarParams').disabled = true;
      document.getElementById('txtResultado').innerHTML = 'Esperando que se resuelva el modelo con los parámetros indicados, el límite de tiempo es 5 minutos';

      var countDownDate = new Date().getTime() + 5 * 60000;
      var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";

        // If the count down is over, write some text 
        if (distance < 0) {
          clearInterval(x);
          document.getElementById("timer").innerHTML = "EXPIRED";
        }
      }, 1000);


      if (ws.readyState === 1) {
        ws.send(parametros);
        console.log("se mando");
      }
      else {
        console.log("se mamo", ws.readyState);
        const ws = new WebSocket(serverAddress);
      };
    }
  };

  ws.onmessage = function (msg) {
    if (msg.data.toString().startsWith("Tiempo")) {
      console.log(msg.data);
      var array = msg.data.toString().split(":");
      document.getElementById('txtResultado').innerHTML = 'El modelo encontró una solución en ' + array[1];
      document.getElementById('btnVerEnVivo').disabled = false;
      document.getElementById("timer").style.display = "none";
    }
    else if (msg.data.toString().startsWith("Excedio")) {
      console.log(msg.data);
      document.getElementById('txtResultado').innerHTML = 'El modelo se excedió en el tiempo de respuesta y no encontró solución';
      document.getElementById("timer").style.display = "none";
      document.getElementById('btnVerEnVivo').disabled = true;
    }
  };

  return (
    <>

      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="row tituloSnippet">
            Código de laberinto:
          </div>
          <div className="row snippet">
            <div dangerouslySetInnerHTML={{ __html: marked(markdown) }}></div>
          </div>
          <div className="row mt">
            <div className="col-6 tituloSnippet">
              Parámetros a modificar:
            </div>
            <div className="col-6 parametros" >
              <form>
                <div className="form-group">
                  <label htmlFor="parametro1">Gamma (0 a 1)</label>
                  <input type="text" className="form-control" id="parametro1" placeholder="Ingresar valor de gamma" />
                </div>
                <div className="form-group">
                  <label htmlFor="parametro2">Tasa de Aprendizaje (0 a 1)</label>
                  <input type="text" className="form-control" id="parametro2" placeholder="Ingresar taza de aprendizaje" />
                </div>
                <div className="form-group">
                  <label htmlFor="parametro3">Número de iteraciones (600 a 1500)</label>
                  <input type="text" className="form-control" id="parametro3" placeholder="Ingresar número de iteraciones deseadas" />
                </div>
                <div className="errorMessage" id="error"> </div>
                <button type="button" id="btnEnviarParams" onClick={enviarParametros} className="btn btn-primary mt-2">Comprobar</button>
              </form>
            </div>
          </div>

        </div>

        <div className="col-12 col-lg-6">
          <div className="row tituloSnippet">
            Laberinto usado para el ejercicio:
          </div>
          <div className="row align-center">
            <img src="pyamaze.png" className="imagenMaze" alt="Imagen Pyamaze" />
          </div>
          <div className="row">
            <div className="col-12 resultado" id="txtResultado"></div>
            <div id="timer" className="timer"> </div>
            <div className="col-4 btnVer">
              <form action="https://google.com" target="_blank">
                <button  type="submit" width="100px" className="btn btn-primary mt-2 btnVer" id="btnVerEnVivo" disabled={true}>Ver ejecución en vivo</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Laberinto