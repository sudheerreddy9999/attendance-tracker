"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import Loader from "@/app/components/loader";
import Modal from "@/app/components/modal";
import { useRouter } from "next/navigation";
const Login = () => {
  const { saveToken } = useAuth();
  const [email, setEmail] = useState("sudheerjanga9999@gmail.com");
  const [password, setPassword] = useState("sudheer@123");
  const [message, setMessage] = useState("");
  const [openLoader,setOpenLoader] = useState(false);
  const [openModal,setOpenModal] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenLoader(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setOpenLoader(false);
    setOpenModal(true);
    if (response.ok) {
      saveToken(data.token);
      const decodedToken = jwtDecode(data.token);
      setMessage("Success !");
      setTimeout(()=>{
        if (decodedToken.userType === "teacher") {
          router.push("/teacher");
        } else if(decodedToken.userType === "user") {
          router.push("/students");
        }else {
          router.push("/auth/login");
        }
      },2000)
    } else {

      setMessage(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>
        <div className="text-start text-sm text-gray-600">
          <p>
            <a href="/auth/reset-password" className="text-blue-500 hover:underline">
              change password
            </a>
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Login
        </button>
      </form>
      {openLoader?<Loader/>:null}
      {openModal ? <Modal modalMessage={message} handleClose={()=>setOpenModal(false)}/>:null}
    </div>
  );
};

export default Login;
