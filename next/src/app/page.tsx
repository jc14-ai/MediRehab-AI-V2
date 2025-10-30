'use client'

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-blue-100">
      <form className="flex justify-evenly items-center flex-col bg-gray-50 w-[400px] h-[400px] rounded-xl p-5" action="" method="POST"> 
        <h1 className="text-blue-400 font-bold text-4xl">MediRehab AI</h1>
        <span className="flex flex-col w-full h-fit gap-2">
          <h1 className="font-light text-gray-500">Username</h1>
          <input className="rounded-xl p-2 focus:outline-none focus:border-2 focus:border-blue-400 focus:duration-100 border border-gray-300 bg-blue-50 text-[0.9em]" placeholder="Enter Username"/>
        </span>
        <span className="flex flex-col w-full h-fit gap-2">
          <h1 className="font-light text-gray-500">Password</h1>
          <input className="rounded-xl p-2 focus:outline-none focus:border-2 focus:border-blue-400 focus:duration-100 border border-gray-300 bg-blue-50 text-[0.9em]" placeholder="Enter Password"/>
        </span>
        <button className="h-[45px] w-full bg-blue-500 rounded-xl text-white cursor-pointer hover:bg-blue-400 duration-200" 
        onClick={() => router.push("/admin")}>
          Login
        </button>
      </form>
    </div>
  );
}
