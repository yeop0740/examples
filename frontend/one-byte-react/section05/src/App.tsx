import {useState} from "react";
import './App.css';

/**
 * Header 컴포넌트는 App 컴포넌트의 자식 컴포넌트가 된다.
 * App 컴포넌트는 Header 컴포넌트의 부모 컴포넌트가 된다.
 */
function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            {count}
            <button
                onClick={() => {
                    setCount(count + 1);
                }}
            >
                +
            </button>
        </>
    );
}

export default App
