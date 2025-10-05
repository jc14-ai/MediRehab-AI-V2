type ButtonProps = {
    text:string;
    event?: () => void
}

export default function Button({text, event}:ButtonProps){
    return (
        <button className="" onSubmit={event}>{text}</button>
    );
}