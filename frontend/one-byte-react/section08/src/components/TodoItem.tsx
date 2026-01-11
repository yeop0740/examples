import "./TodoItem.css";

const TodoItem = ({content, createdAt}) => {
    return (
        <div className="TodoItem">
            <input type="checkbox"/>
            <div className="content">{content}</div>
            <div className="createdAt">{createdAt.toLocaleDateString()}</div>
            <button>삭제</button>
        </div>
    );
}

export default TodoItem;
