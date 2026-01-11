import './DateHeader.css';

const DateHeader = () => {
    const today = new Date();
    return (
        <section>
            <div className="date">오늘은 📅</div>
            <h1>{today.toDateString()}</h1>
        </section>
    );
}

export default DateHeader;
