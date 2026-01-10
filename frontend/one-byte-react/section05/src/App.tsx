import './App.css'
import Header from "./components/Header.tsx";

/**
 * Header 컴포넌트는 App 컴포넌트의 자식 컴포넌트가 된다.
 * App 컴포넌트는 Header 컴포넌트의 부모 컴포넌트가 된다.
 */
function App() {
  return (
    <>
        <Header />
        <h1>안녕 리액트!</h1>
    </>
  )
}

export default App
