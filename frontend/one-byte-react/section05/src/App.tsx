import './App.css';
import Bulb from "./components/Bulb.tsx";
import Counter from "./components/Counter.tsx";

/**
 * Header 컴포넌트는 App 컴포넌트의 자식 컴포넌트가 된다.
 * App 컴포넌트는 Header 컴포넌트의 부모 컴포넌트가 된다.
 */
function App() {

    /**
     * count 변경 시 App 컴포넌트 리렌더링
     * App 컴포넌트의 자식 컴포넌트인 Bulb 컴포넌트도 리렌더링 된다. - count 와 관련 없는 컴포넌트가 리렌더링 된다.
     */
    return (
        <>
            <Bulb />
            <Counter />
        </>
    );
}

export default App
