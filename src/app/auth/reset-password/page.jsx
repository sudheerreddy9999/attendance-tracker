"use client";
import { useState } from "react";
import Loader from "@/app/components/loader";
import Modal from "@/app/components/modal";
import { useRouter } from "next/navigation";
const changePassword = () => {
  const [email, setEmail] = useState("sudheerjanga9999@gmail.com");
  const [previousPassword, setPreviousPassword] = useState("Sudheer@7881");
  const [password, setPassword] = useState("Sudheer@123");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/users/resetPassword", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, previousPassword }),
    });

    const data = await response.json();
    setLoading(false);
    if (response.ok) {
      setOpenModal(true);
      setMessage(data.message);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } else {
      setOpenModal(true);
      setMessage(data.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Change Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Previous Password:
            </label>
            <input
              type="password"
              value={previousPassword}
              onChange={(e) => setPreviousPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              New Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="text-start  ml-2 text-gray-600 mb-4">
            <p>
              <a
                href="/auth/login"
                className="text-blue-500 hover:text-blue-600 underline hover:underline-offset-2 transition duration-200 ease-in-out"
              >
                login
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? "Resetting Password..." : "Reset"}
          </button>
        </form>
      </div>
      {loading ? <Loader /> : null}
      {openModal ? (
        <Modal modalMessage={message} handleClose={() => setOpenModal(false)} />
      ) : null}
    </div>
  );
};

export default changePassword;
