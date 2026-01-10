import "./Controller.css";

const Controller = ({count, setCount}) => {
    const onClick = (e) => {
        setCount(Number(count) + Number(e.target.value));
    }

    return (
        <div className="controller">
            <button value="-1" onClick={onClick}>-1</button>
            <button value="-10" onClick={onClick}>-10</button>
            <button value="-100" onClick={onClick}>-100</button>
            <button value="100" onClick={onClick}>+100</button>
            <button value="10" onClick={onClick}>+10</button>
            <button value="1" onClick={onClick}>+1</button>
        </div>
    )
}

export default Controller;
