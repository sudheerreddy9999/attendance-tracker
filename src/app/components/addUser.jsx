"use client";
import { useState, useEffect } from "react";
import Loader from "./loader";
import Modal from "./modal";

const AddUser = ({ handleClose, userData }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");

  const [loaderEnable, setLoaderEnable] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [enableModal, setEnableModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  useEffect(() => {
    console.log(userData," User data Value is ")
    console.log(userData.email," dhhhhhhhhhhhhhhhhhhh")
    console.log(userData._id,"jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    if (userData) {
      setEmail(userData.email || "");
      setPassword(userData.password || "");
      setUserType(userData.userType || "user");
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setPhone(userData.phone || "");
      setDob(userData.dob || "");
      setEnrollmentNumber(userData.enrollmentNumber || "");
      setYear(userData.year || "");
      setSection(userData.section || "");
      setGuardianName(userData.guardian?.name || "");
      setGuardianContact(userData.guardian?.contact || "");
    }
  }, [userData]); // Dependency on userData to update when it changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoaderEnable(true);
    setLoading(true);
    const token = sessionStorage.getItem("authToken");

    // Determine the URL and method (POST for new user, PUT for update)
    const url = userData ? "/api/users/update" : "/api/auth/signup"; 
    const method = userData ? "PUT" : "POST"; 

    const payload = {
      id: userData?._id,  // Include the user ID if updating
      email,
      password,
      userType,
      firstName,
      lastName,
      phone,
      dob,
      enrollmentNumber,
      year,
      section,
      guardian: { name: guardianName, contact: guardianContact },
    };

    // Remove `id` from the payload if it's undefined (new user creation doesn't need it)
    if (!userData?._id) {
      delete payload.id;
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      setLoaderEnable(false);
      handleClose(); // Close the modal after successful submission
    } else {
      setError(data.message);
      setLoaderEnable(false);
      setModalMessage(data.message);
      setEnableModal(true);
    }

    setLoading(false);
  };

  const handleButtonClose = () => {
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[80%] md:w-[60%]">
        <h2 className="text-xl mb-4 text-center">{userData ? "Edit User" : "Add New User"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Row */}
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Second Row */}
          <div className="mb-4">
            <label className="block">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block">Guardian Name</label>
            <input
              type="text"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Third Row */}
          <div className="mb-4">
            <label className="block">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block">DOB</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Fourth Row */}
          <div className="mb-4">
            <label className="block">Enrollment Number</label>
            <input
              type="text"
              value={enrollmentNumber}
              onChange={(e) => setEnrollmentNumber(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block">Section</label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-between gap-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            >
              {userData ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={handleButtonClose}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {loading && <Loader />}
      {enableModal && (
        <Modal message={modalMessage} closeModal={() => setEnableModal(false)} />
      )}
    </div>
  );
};

export default AddUser;
