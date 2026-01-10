import './App.css'
import Viewer from "./components/Viewer.tsx";
import Controller from "./components/Controller.tsx";
import {useState} from "react";

function App() {
    const [count, setCount] = useState(0);

    const onClickButton = (value) => {
        setCount(count + value);
    }

    return (
        <div className="App">
            <h1>
                카운터 앱
            </h1>
            <section>
                <Viewer count={count}/>
            </section>
            <section>
                <Controller onClickButton={onClickButton}/>
            </section>
        </div>
    )
}

export default App
