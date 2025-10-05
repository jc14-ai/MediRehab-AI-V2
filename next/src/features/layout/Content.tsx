import {ReactNode} from "react";

type PageProps = {
    children: ReactNode;
}

export default function Content({children}:PageProps){
    return(
        <main className="flex flex-col justify-center items-center bg-white w-sceen h-screen">
            {children}
        </main>
    );
}