import './DateHeader.css';

const DateHeader = () => {
    const today = new Date();
    return (
        <div className="DateHeader">
            <h3>오늘은 📅</h3>
            <h1>{today.toDateString()}</h1>
        </div>
    );
}

export default DateHeader;
