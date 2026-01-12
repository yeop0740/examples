import './App.css'
import DateHeader from "./components/DateHeader.tsx";
import CreateTodoForm from "./components/CreateTodoForm.tsx";
import TodoBoard from "./components/TodoBoard.tsx";
import {useReducer, useRef} from "react";

const mockData = [
    {
        id: 1,
        content: "React 공부하기",
        createdAt: new Date("2025-01-11T15:24:00.000+09:00"),
        isDone: false,
    },
    {
        id: 2,
        content: "빨래 널기",
        createdAt: new Date("2025-01-11T15:25:00.000+09:00"),
        isDone: false,
    },
    {
        id: 3,
        content: "노래 연습하기",
        createdAt: new Date("2025-01-11T15:26:00.000+09:00"),
        isDone: false,
    },
];

function reducer(state, action) {
    switch(action.type) {
        case "CREATE":
            return [action.data, ...state];
        case "UPDATE" :
            return state.map(todo => todo.id === action.targetId ? {...todo, isDone: !todo.isDone} : todo);
        case "DELETE":
            return state.filter(todo => todo.id !== action.targetId);
        default:
            return state;
    }
}

function App() {
    const [todos, dispatch] = useReducer(reducer, mockData);
    const idRef = useRef(4);

    const onCreate = ({content, createdAt}) => {
        dispatch({
            type: "CREATE",
            data: {
                id: idRef.current,
                content,
                createdAt,
                isDone: false,
            },
        });
    };

    const onDelete = ({id}) => {
        dispatch({
            type: "DELETE",
            targetId: id,
        });
    };

    const onUpdate = (id) => {
        dispatch({
            type: "UPDATE",
            targetId: id,
        });
    };

    return (
        <div className="App">
            <DateHeader />
            <CreateTodoForm
                onCreate={onCreate}
            />
            <TodoBoard
                todos={todos}
                onDelete={onDelete}
                onUpdate={onUpdate}
            />
        </div>
    );
}

export default App
