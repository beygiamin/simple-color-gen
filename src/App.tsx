import { useState } from "react";
import { RgbColor, Sketch } from "@uiw/react-color";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
     const [hex, setHex] = useState("#fff");
     const [gradient, setGradient] = useState(new Array<RgbColor>());
     return (
          <main className="container">
               <Sketch
                    style={{
                         margin: "1rem 0",
                    }}
                    color={hex}
                    onChange={color => {
                         setHex(color.hex);
                         invoke<RgbColor[]>("generate_gradient", {
                              color: color.rgb,
                         }).then(grad => {
                              setGradient(grad);
                         });
                    }}
               />
               {gradient.map(grad => (
                    <div
                         style={{
                              padding: "1rem",
                              backgroundColor: `rgb(${grad.r}, ${grad.g}, ${grad.b})`,
                         }}
                    >
                         rgb({grad.r}, {grad.g}, {grad.b})
                    </div>
               ))}
          </main>
     );
}

export default App;
