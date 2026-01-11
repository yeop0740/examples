import "./CreateTodoForm.css";
import {useState} from "react";

const CreateTodoForm = ({onCreate}) => {
    const [input, setInput] = useState("");

    const onSubmit = () => {
        onCreate({content: input, createdAt: new Date()})
    }

    return (
        <div className="CreateTodoForm">
            <input
                placeholder="할 일을 입력하세요"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value)
                }}
            />
            <button
                onClick={onSubmit}>
                추가
            </button>
        </div>
    )
}

export default CreateTodoForm;
