import './App.css'
import Viewer from "./components/Viewer.tsx";
import Controller from "./components/Controller.tsx";
import {useEffect, useRef, useState} from "react";
import Even from "./components/Even.tsx";

function App() {
    const [count, setCount] = useState(0);
    const [input, setInput] = useState("");

    const isMount = useRef(false);

    /**
     * 1. 마운트
     * 해당 deps 에는 아무런 값도 없으므로 처음 호출 이후 다시 실행되지 않는다.
     * 즉, 마운트 때만 실행된다.
     */
    useEffect(() => {
        console.log("마운트");
    }, []);

    /**
     * 2. 업데이트
     * 마운트와 업데이트가 있을 때마다 콜백이 실행된다.
     */
    useEffect(() => {
        console.log("마운트 혹은 업데이트");
    });

    useEffect(() => {
        if (!isMount.current) {
            isMount.current = true;
            return;
        }
        console.log("마운트 이후 업데이트");
    });


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
                {count % 2 === 0 ? <Even/> : null}
            </section>
            <section>
                <Controller onClickButton={onClickButton}/>
            </section>
        </div>
    )
}

export default App
