"use client";
import { useState, useEffect } from "react";
import Loader from "./loader";
import Modal from "./modal";
import { AiOutlineClose } from "react-icons/ai";

const AddUser = ({ handleClose, userData,userUpdate }) => {
  const [email, setEmail] = useState("");
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
  const [buttonText, setButtonText] = useState("Save");
  const [loaderEnable, setLoaderEnable] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [enableModal, setEnableModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  useEffect(() => {
    if (userData.length === 0) return;
    if (userData) {
      setButtonText("update");
      setEmail(userData.email || "");
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
  }, [userData]);

  useEffect(() => {
    if (userData && userData.dob) {
      const formattedDob = new Date(userData.dob).toISOString().split("T")[0];
      setDob(formattedDob);
    } else {
      setDob("");
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoaderEnable(true);
    setLoading(true);
    const token = sessionStorage.getItem("authToken");

    const url = buttonText === 'update' ? "/api/users/update" : "/api/auth/signup"; 
    const method = buttonText === 'update' ? "PUT" : "POST"; 

    const payload = {
      id: userData?._id,
      email,
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
      userUpdate()
      handleClose();
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
      <div className="bg-white p-4 rounded-lg w-[70%] md:w-[50%]">
        <div className="flex items-center justify-between">
          <h1 className="text-lg mb-4 font-bold text-center flex-grow">
            {buttonText === "Save" ? "Add New User" : "Edit User"}
          </h1>
          <button
            type="button"
            onClick={handleButtonClose}
            className="text-black hover:text-black-700"
          >
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Row */}
          <div className="mb-2">
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="Enter first name"
            />
          </div>
    
          {/* Second Row */}
          <div className="mb-2">
            <label className="block text-sm">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="Enter phone number"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Guardian Name</label>
            <input
              type="text"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="Enter guardian name"
            />
          </div>
    
          {/* Third Row */}
          <div className="mb-2">
            <label className="block text-sm">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="Enter last name"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">DOB</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="Select date of birth"
            />
          </div>
    
          {/* Fourth Row */}
          <div className="mb-2">
            <label className="block text-sm">Enrollment Number</label>
            <input
              type="text"
              value={enrollmentNumber}
              onChange={(e) => setEnrollmentNumber(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="Enter enrollment number"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Section</label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="Enter section"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="Enter year"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">guardian contact</label>
            <input
              type="text"
              value={guardianContact}
              onChange={(e) =>  setGuardianContact(e.target.value)}
              className="w-[80%] md:w-[95%] p-2 text-sm border rounded-md mx-auto"
              placeholder="guardianContact"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    
      {loading && <Loader />}
      {enableModal && (
        <Modal message={modalMessage} closeModal={() => setEnableModal(false)} />
      )}
    </div>
  )
};

export default AddUser;
