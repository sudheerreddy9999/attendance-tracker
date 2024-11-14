'use client'
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
export default function Home() {
  const {userType} = useAuth();
  const router = useRouter();
  useEffect(()=>{
    console.log(userType," UserTpe value is ")
    if (userType === "teacher") {
      router.push("/teacher");
    } else if(userType === "user") {
      router.push("/students");
    }else {
      router.push("/auth/login");
    }
  },[userType])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    </div>
  );
}
