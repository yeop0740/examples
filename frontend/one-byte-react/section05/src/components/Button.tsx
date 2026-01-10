import * as React from "react";

const Button = ({children, text, color = "black"}: {children?: React.ReactNode, text: string, color?: string}) => {
    return <button
        onClick={() => console.log(text)}
        style={{color: color}}>
        {text} - {color.toUpperCase()}
        {children}
    </button>;
};

export default Button;
