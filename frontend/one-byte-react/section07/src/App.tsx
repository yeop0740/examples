import './App.css'
import Viewer from "./components/Viewer.tsx";
import Controller from "./components/Controller.tsx";
import {useEffect, useState} from "react";

function App() {
    const [count, setCount] = useState(0);
    const [input, setInput] = useState("");

    /**
     * 의존성 배열, dependency array, deps
     * useEffect 는 두 번째 배열 인자에 의존한다.
     */
    useEffect(() => {
        console.log(`count: ${count}, input: ${input}`);
    }, [count, input]);

    const onClickButton = (value) => {
        setCount(count + value); // 비동기적으로 실행됨
        // console.log(count); // -> 이렇게 하면 되는 것 아님? 이라고 할 수 있지만, state 변경 함수는 비동기라서 이 라인이 실행 되고 난 뒤, 변경됨.
    }

    return (
        <div className="App">
            <h1>
                카운터 앱
            </h1>
            <section>
                <input
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                />
            </section>
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
