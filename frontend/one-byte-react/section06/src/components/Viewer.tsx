const Viewer = ({count}) => {
    return (
        <div className="viewer">
            <div>현재 카운트: </div>
            <h1>{count}</h1>
        </div>
    );
}

export default Viewer;
