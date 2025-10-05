import Button from "@/features/forms/signIn/components/Button";
import Input from "@/features/forms/signIn/components/Input";
import Label from "@/features/forms/signIn/components/Label";
import Wrapper from "@/features/forms/signIn/components/Wrapper";
import SignInForm from "@/features/forms/signIn/SignInForm";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-white">
      <SignInForm>  
        <h1 className="text-black">Sign In</h1>
        <Wrapper>
          <Label text="Username"/>
          <Input placeholder="Username"/>
        </Wrapper>
        <Wrapper>
          <Label text="Password"/>
          <Input placeholder="Password"/>
        </Wrapper>
        <Button text="Sign In"/>
      </SignInForm>
    </div>
  );
}
