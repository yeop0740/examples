import * as React from "react";

const Button = ({children, text, color = "black"}: {children?: React.ReactNode, text: string, color?: string}) => {
    const onClickButton = (e) => {
        console.log(e);
        console.log(text);
    };

    return <button
        onClick={onClickButton}
        style={{color: color}}>
        {text} - {color.toUpperCase()}
        {children}
    </button>;
};

export default Button;
