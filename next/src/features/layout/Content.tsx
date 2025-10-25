import {ReactNode} from "react";

type PageProps = {
    className?:string;
    children: ReactNode;
}

export default function Content({children, className="flex flex-col justify-center items-center bg-white w-sceen h-screen"}:PageProps){
    return(
        <main className={className}>
            {children}
        </main>
    );
}