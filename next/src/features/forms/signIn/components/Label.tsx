type LabelProps = {
    text:string;
}

export default function Label({text}:LabelProps){
    return (
        <label className="text-black">{text}</label>
    );
}