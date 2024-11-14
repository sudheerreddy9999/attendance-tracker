"use client";
import withRoleProtection from "../../utils/withRoleProtection";
import AddUser from "../../components/AddUser";
import { useEffect, useState } from "react";
import Loader from "@/app/components/loader";
import { AiOutlineEdit } from "react-icons/ai";

const ManageUsers = () => {
  const [addUser, setAddUser] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openLoader, setOpenLoader] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Number of users per page

  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    const token = sessionStorage.getItem("authToken");
    try {
      const response = await fetch("/api/users/getusers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStudentData(data.users);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const filteredUsers = studentData.filter(
    (user) =>
      user.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setAddUser(true);
  };

  return (
    <div className="m-10 my-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => handleEditClick([])}
          className="bg-slate-800 m-5 text-sm rounded-lg text-white px-3 py-2"
        >
          Add New User
        </button>
        <input
          type="text"
          placeholder="Search by Enrollment number, name, or section"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="m-5 p-2 border rounded-lg text-sm"
        />
      </div>

      {addUser && (
        <AddUser
          handleClose={() => setAddUser(false)}
          userData={selectedUser}
          userUpdate={() => fetchUsers()}
        />
      )}

      <table className="min-w-full bg-white border border-gray-300 mt-5 rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr className="text-left text-sm font-semibold text-gray-700">
            <th className="p-3 px-4">Enrollment Number</th>
            <th className="p-3 px-4">Email</th>
            <th className="p-3 px-4">First Name</th>
            <th className="p-3 px-4">Last Name</th>
            <th className="p-3 px-4">Phone</th>
            <th className="p-3 px-4">DOB</th>
            <th className="p-3 px-4">Year</th>
            <th className="p-3 px-4">Section</th>
            <th className="p-3 px-4">Guardian Name</th>
            <th className="p-3 px-4">Guardian Contact</th>
            <th className="p-3 px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user._id}
              className="border-b hover:bg-gray-200 transition-colors duration-200"
            >
              <td className="p-3 px-4">{user.enrollmentNumber}</td>
              <td className="p-3 px-4">{user.email}</td>
              <td className="p-3 px-4">{user.firstName}</td>
              <td className="p-3 px-4">{user.lastName}</td>
              <td className="p-3 px-4">{user.phone}</td>
              <td className="p-3 px-4">
                {new Date(user.dob).toLocaleDateString()}
              </td>
              <td className="p-3 px-4">{user.year}</td>
              <td className="p-3 px-4">{user.section}</td>
              <td className="p-3 px-4">{user.guardian?.name || "N/A"}</td>
              <td className="p-3 px-4">{user.guardian?.contact || "N/A"}</td>
              <td className="p-3 px-4">
              <button
  onClick={() => handleEditClick(user)}
  className="bg-slate-600 text-sm text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
>
  Edit <AiOutlineEdit className="ml-2 text-[17px]" />
</button>
              </td>
            </tr>
          ))}

          {currentUsers.length === 0 && (
            <tr>
              <td colSpan="11" className="p-3 px-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-l-lg disabled:bg-gray-300"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 border-t border-b ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {openLoader ? <Loader /> : null}
    </div>
  );
};

export default withRoleProtection(ManageUsers, ["teacher", "admin"]);
