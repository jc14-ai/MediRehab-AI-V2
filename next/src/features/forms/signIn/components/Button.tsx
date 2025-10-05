type ButtonProps = {
    text:string;
    event?: () => void
}

export default function Button({text, event}:ButtonProps){
    return (
        <button className="text-black border-1 border-black rounded-4xl w-[100px]" onSubmit={event}>{text}</button>
    );
}