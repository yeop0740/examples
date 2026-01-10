const Main = () => {
    const number = 10;

    return (
        <main>
            <h1>main</h1>
            <h2>{number % 2 === 0 ? '짝수' : '홀수'}</h2>
            {10}
            {number}
            {[1, 2, 3]}
        </main>
    );
};

export default Main
