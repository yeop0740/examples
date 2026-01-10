import './App.css'
import Button from "./components/Button.tsx";

/**
 * Header 컴포넌트는 App 컴포넌트의 자식 컴포넌트가 된다.
 * App 컴포넌트는 Header 컴포넌트의 부모 컴포넌트가 된다.
 */
function App() {
    const buttonProps = {
        text: "메일",
        color: "red",
        a: 1,
        b: 2,
        c: 3,
    };

  return (
    <>
        <Button {...buttonProps} />
        <Button text={"카페"} color={"blue"} />
        <Button text={"블로그"}>
            <div>자식 요소</div>
        </Button>
    </>
  )
}

export default App
