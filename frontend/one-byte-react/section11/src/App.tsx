import './App.css'
import {Link, Route, Routes} from "react-router";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary.tsx";
import Notfound from "./pages/Notfound.tsx";

function App() {
    return (
        <>
            <div>
                <Link to={"/"}>Home</Link>
                <Link to={"/new"}>New</Link>
                <Link to={"/diary"}>Diary</Link>
            </div>
            <Routes>
            {/*Routes 컴포넌트 안에는 Route 컴포넌트만 들어갈 수 있다.*/}
                <Route path="/" element={<Home/>}/>
                <Route path="/new" element={<New/>}/>
                <Route path="diary" element={<Diary/>}/>
                <Route path="*" element={<Notfound/>}/>
            </Routes>
        </>
    );
}

export default App
