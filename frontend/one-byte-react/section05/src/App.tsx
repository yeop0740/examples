import {useState} from "react";
import './App.css';

const Bulb = ({light}) => {
    console.log(light);

    return (
        <div>
            {light === "ON" ?
                <h1 style={{backgroundColor: "orange"}}>ON</h1> :
                <h1 style={{backgroundColor: "gray"}}>OFF</h1>}
        </div>
    );
}

/**
 * Header 컴포넌트는 App 컴포넌트의 자식 컴포넌트가 된다.
 * App 컴포넌트는 Header 컴포넌트의 부모 컴포넌트가 된다.
 */
function App() {
    const [count, setCount] = useState(0);
    const [light, setLight] = useState("OFF");

    return (
        <>
            <div>
                <Bulb light={light} />
                <button
                    onClick={() => {
                        setLight(light === "ON" ? "OFF" : "ON");
                    }}>
                    {light === "ON" ? "끄기" : "켜기"}
                </button>
            </div>
            <div>
                {count}
                <button
                    onClick={() => {
                        setCount(count + 1);
                    }}
                >
                    +
                </button>
            </div>
        </>
    );
}

export default App
