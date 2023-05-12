import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import { marked } from "marked";
import { useEffect, useRef } from "react";


const markdown = `
\`\`\`python
%%time
"""Training the agent"""

import random
from IPython.display import clear_output

# Hyperparameters
alpha = 0.1
gamma = 0.6
epsilon = 0.1

# For plotting metrics
all_epochs = []
all_penalties = []

for i in range(1, 100001):
state = env.reset()

epochs, penalties, reward, = 0, 0, 0
done = False

while not done:
if random.uniform(0, 1) &lt; epsilon:
action = env.action_space.sample() # Explore action space
else:
action = np.argmax(q_table[state]) # Exploit learned values

next_state, reward, done, info = env.step(action)

old_value = q_table[state, action]
next_max = np.max(q_table[next_state])

new_value = (1 - alpha) * old_value + alpha * (reward + gamma * next_max)
q_table[state, action] = new_value

if reward == -10:
penalties += 1

state = next_state
epochs += 1

if i % 100 == 0:
clear_output(wait=True)
print(f"Episode: {"i"}")

print("Training finished.")
\`\`\`
`;

const Laberinto = () => {

  useEffect(() => {
    hljs.highlightAll();
  });

 

  const serverAddress = 'wss://aia-remote-websocket-server.glitch.me/';
  
  const ws = new WebSocket(serverAddress);
  
  ws.onopen = function() {
    ws.send("Soy el lab");
  };
  
 
  function enviarParametros() {
    var parametros = 'Parametros:' + document.getElementById('parametro1').value + ',' +  document.getElementById('parametro2').value + ',' + document.getElementById('parametro3').value;
    console.log(parametros);
    
    if(ws.readyState===1){
      ws.send(parametros);
      console.log("se mando");
    };
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
                  <label htmlFor="parametro1">Parámetro 1</label>
                  <input type="text" className="form-control" id="parametro1" placeholder="Ingresar parámetro 1" />
                </div>
                <div className="form-group">
                  <label htmlFor="parametro2">Parámetro 2</label>
                  <input type="text" className="form-control" id="parametro2" placeholder="Ingresar parámetro 2" />
                </div>
                <div className="form-group">
                  <label htmlFor="parametro3">Parámetro 3</label>
                  <input type="text" className="form-control" id="parametro3" placeholder="Ingresar parámetro 3" />
                </div>
                <button type="button" id="btnEnviarParams" onClick={enviarParametros} className="btn btn-primary mt-2">Comprobar</button>
              </form>
            </div>
          </div>

        </div>

        <div className="col-12 col-lg-6">
          <div className="row tituloSnippet">
              Laberinto resultante:
          </div>
          <div className="row align-center">
            <img src="pyamaze.png" className="imagenMaze" alt="Imagen Pyamaze" />
          </div>
          <div className="row">
            <div className="col-12 resultado">Para los parámetros asignados el resultado es: Sí converge.</div>
            <div className="col-4 btnComprobar"><button type="submit" width="100px" className="btn btn-primary mt-2 btnComprobar">Ejecutar en brazo mecánico</button></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Laberinto