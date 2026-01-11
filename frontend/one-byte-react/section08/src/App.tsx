import './App.css'
import DateHeader from "./components/DateHeader.tsx";
import CreateTodoForm from "./components/CreateTodoForm.tsx";
import TodoBoard from "./components/TodoBoard.tsx";

function App() {
    return (
        <div className="App">
            <DateHeader/>
            <CreateTodoForm/>
            <TodoBoard />
        </div>
    );
}

export default App
