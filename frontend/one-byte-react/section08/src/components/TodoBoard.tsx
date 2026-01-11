import SearchTodoForm from "./SearchTodoForm.tsx";
import {useState} from "react";
import TodoItem from "./TodoItem.tsx";
import "./TodoBoard.css";

const TodoBoard = ({todos, onDelete, onUpdate}) => {
    const [keyword, setKeyword] = useState("");

    const onSearch = (keyword) => {
        setKeyword(keyword);
    }

    const searchFiltering = () => {
        return todos.filter(todo => todo.content.toLowerCase().includes(keyword.toLowerCase()));
    }

    const filteredTodos = searchFiltering();

    return (
        <div className="TodoBoard">
            <h4>Todo List ✅</h4>
            <SearchTodoForm onSearch={onSearch}/>
            <div
                className="TodoItems"
            >
                {filteredTodos.map(todo => <TodoItem key={todo.id} {...todo} onDelete={onDelete} onUpdate={onUpdate} />)}
            </div>
        </div>
    );
}

export default TodoBoard;
