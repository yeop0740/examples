import './App.css'

/**
 * 함수 컴포넌트
 * 컴포넌트는 아래와 같은 함수 컴포넌트, 화살표 함수 컴포넌트, 클래스 컴포턴트 형태로 작성할 수 있다.
 * 컴포넌트는 첫 글자를 대문자로 작성해야 한다.
 */
function Header() {
    return (
        <header>
            <h1>header</h1>
        </header>
    );
}

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
