import './App.css'
import Viewer from "./components/Viewer.tsx";
import Controller from "./components/Controller.tsx";
import {useState} from "react";

function App() {
    const [count, setCount] = useState(0);

  return (
    <>
        <h1>
            카운터 앱
        </h1>
        <Viewer count={count}/>
        <Controller count={count} setCount={setCount}/>
    </>
  )
}

export default App
