import "./CreateTodoForm.css";
import {useRef, useState} from "react";

const CreateTodoForm = ({onCreate}) => {
    const [input, setInput] = useState("");
    const inputRef = useRef();

    const onSubmit = () => {
        if (input == "") {
            inputRef.current.focus();
            return;
        }
        onCreate({content: input, createdAt: new Date()})
        setInput("");
    };

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSubmit();
        }
    };

    return (
        <div className="CreateTodoForm">
            <input
                ref={inputRef}
                placeholder="할 일을 입력하세요"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value)
                }}
                onKeyDown={onKeyDown}
            />
            <button
                onClick={onSubmit}>
                추가
            </button>
        </div>
    )
}

export default CreateTodoForm;
