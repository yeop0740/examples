import SearchTodoForm from "./SearchTodoForm.tsx";
import {useState} from "react";
import TodoItem from "./TodoItem.tsx";
import "./TodoBoard.css";

const TodoBoard = ({todos, onDelete}) => {
    const [keyword, setKeyword] = useState("");

    const onSearch = (keyword) => {
        setKeyword(keyword);
    }

    return (
        <div className="TodoBoard">
            <h4>Todo List ✅</h4>
            <SearchTodoForm onSearch={onSearch}/>
            <div
                className="TodoItems"
            >
                {
                    todos
                        .filter(todo => todo.content.includes(keyword))
                        .map(todo => <TodoItem key={todo.id} onDelete={onDelete} {...todo} />)
                }
            </div>
        </div>
    );
}

export default TodoBoard;
