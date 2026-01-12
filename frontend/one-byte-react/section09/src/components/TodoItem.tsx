import "./TodoItem.css";

const TodoItem = ({id, content, createdAt, isDone, onDelete, onUpdate}) => {

    const onSubmit = () => {
        onDelete({id});
    }

    const onChangeChecked = () => {
        onUpdate(id);
    }

    return (
        <div className="TodoItem">
            <input type="checkbox" checked={isDone} onChange={onChangeChecked}/>
            <div className="content">{content}</div>
            <div className="createdAt">{createdAt.toLocaleDateString()}</div>
            <button onClick={onSubmit}>삭제</button>
        </div>
    );
}

export default TodoItem;
