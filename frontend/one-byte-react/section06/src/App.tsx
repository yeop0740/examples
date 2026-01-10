import './App.css'
import Viewer from "./components/Viewer.tsx";
import Controller from "./components/Controller.tsx";
import {useState} from "react";

function App() {
    const [count, setCount] = useState(0);

  return (
    <div className="App">
        <h1>
            카운터 앱
        </h1>
        <section>
            <Viewer count={count}/>
        </section>
        <section>
            <Controller count={count} setCount={setCount}/>
        </section>
    </div>
  )
}

export default App
