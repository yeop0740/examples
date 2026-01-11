import './App.css'
import DateHeader from "./components/DateHeader.tsx";
import CreateToDoForm from "./components/CreateToDoForm.tsx";
import TodoBoard from "./components/TodoBoard.tsx";

function App() {
    return (
        <div className="App">
            <DateHeader/>
            <CreateToDoForm/>
            <TodoBoard />
        </div>
    );
}

export default App
