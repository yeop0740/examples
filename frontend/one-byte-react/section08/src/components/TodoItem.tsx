const TodoItem = ({content, createdAt}) => {
    return (
        <div>
            <input type="checkbox"/>
            {content}
            {createdAt.toString()}
            <button>삭제</button>
        </div>
    );
}

export default TodoItem;
