import "./TodoItem.css";

const TodoItem = ({id, content, createdAt, onDelete}) => {

    const onSubmit = () => {
        onDelete({id});
    }

    return (
        <div className="TodoItem">
            <input type="checkbox"/>
            <div className="content">{content}</div>
            <div className="createdAt">{createdAt.toLocaleDateString()}</div>
            <button onClick={onSubmit}>삭제</button>
        </div>
    );
}

export default TodoItem;
