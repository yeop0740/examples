const DateHeader = () => {
    const today = new Date();
    return (
        <div>
            <div>오늘은</div>
            <h1>{today.toISOString()}</h1>
        </div>
    );
}

export default DateHeader;
