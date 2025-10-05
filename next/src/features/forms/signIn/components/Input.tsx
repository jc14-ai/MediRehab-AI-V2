type InputProps = {
    placeholder:string;
}

export default function Input({placeholder}:InputProps){
    return(
        <input className="border-1 border-black" placeholder={placeholder}/>
    );
}