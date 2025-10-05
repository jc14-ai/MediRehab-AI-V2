type InputProps = {
    placeholder:string;
}

export default function Input({placeholder}:InputProps){
    return(
        <input className="" placeholder={placeholder}/>
    );
}