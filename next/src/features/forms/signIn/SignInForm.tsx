
import { ReactNode } from "react";

type SignInFormProps = {
    children: ReactNode;
}

export default function SignInForm({children}:SignInFormProps){
    return(
        <form className="flex justify-center items-center flex-col bg-gray-200 w-[500px] h-[600px] rounded-xl shadow-xl" action="" method="POST">
            {children}
        </form>
    );
}