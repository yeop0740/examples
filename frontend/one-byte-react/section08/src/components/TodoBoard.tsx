import SearchTodoForm from "./SearchTodoForm.tsx";
import {useState} from "react";
import TodoItem from "./TodoItem.tsx";
import "./TodoBoard.css";

const mockData = [
    {
        content: "React 공부하기",
        createdAt: new Date("2025-01-11T15:24:00.000+09:00"),
    },
    {
        content: "빨래 널기",
        createdAt: new Date("2025-01-11T15:25:00.000+09:00"),
    },
    {
        content: "노래 연습하기",
        createdAt: new Date("2025-01-11T15:26:00.000+09:00"),
    },
];

const TodoBoard = () => {
    const [todos, setTodos] = useState(mockData);

    const onSearch = (keyword) => {
        const filteredTodos = mockData.filter(todo => todo.content.includes(keyword));
        setTodos(filteredTodos);
    }

    return (
        <div className="TodoBoard">
            <h4>Todo List ✅</h4>
            <SearchTodoForm onSearch={onSearch}/>
            <div className="TodoItems">
                {todos.map(todo => <TodoItem {...todo} />)}
            </div>
        </div>
    );
}

export default TodoBoard;
