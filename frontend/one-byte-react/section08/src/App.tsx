import './App.css'
import DateHeader from "./components/DateHeader.tsx";
import CreateTodoForm from "./components/CreateTodoForm.tsx";
import TodoBoard from "./components/TodoBoard.tsx";
import {useState} from "react";
import {v7} from "uuid";

const mockData = [
    {
        id: "123123-123123-123123-123123",
        content: "React 공부하기",
        createdAt: new Date("2025-01-11T15:24:00.000+09:00"),
    },
    {
        id: "123123-123123-123123-123124",
        content: "빨래 널기",
        createdAt: new Date("2025-01-11T15:25:00.000+09:00"),
    },
    {
        id: "123123-123123-123123-123125",
        content: "노래 연습하기",
        createdAt: new Date("2025-01-11T15:26:00.000+09:00"),
    },
];

function App() {
    const [todos, setTodos] = useState(mockData);

    const onCreate = ({content, createdAt}) => {
        console.log('onCreate');
        const todo = {
            id: v7(),
            content,
            createdAt,
        };

        const newTodos = [...todos, todo];
        setTodos(newTodos);
    }

    return (
        <div className="App">
            <DateHeader/>
            <CreateTodoForm onCreate={onCreate}/>
            <TodoBoard todos={todos} />
        </div>
    );
}

export default App
