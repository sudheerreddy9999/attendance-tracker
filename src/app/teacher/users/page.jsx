"use client";
import withRoleProtection from "../../utils/withRoleProtection";
import AddUser from "../../components/AddUser";
import { useEffect, useState } from "react";

const ManageUsers = () => {
  const [addUser, setAddUser] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = studentData.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.guardian &&
        user.guardian.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClick = (user) => {
    console.log(user, " Inside the main component");
    setSelectedUser(user);
    setAddUser(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => handleEditClick([])}
          className="bg-slate-800 m-5 text-sm rounded-lg text-white px-3 py-2"
        >
          Add New User
        </button>
        <input
          type="text"
          placeholder="Search by email, user type, or guardian name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="m-5 p-2 border rounded-lg"
        />
      </div>

      {addUser && (
        <AddUser
          handleClose={() => setAddUser(false)}
          userData={selectedUser}
        />
      )}

      <table className="min-w-full bg-white border border-gray-300 mt-5">
        <thead>
          <tr className="text-left border-b">
            <>
              <th className="p-3">Enrollment Number</th>
              <th className="p-3">Email</th>
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">DOB</th>
              <th className="p-3">Year</th>
              <th className="p-3">Section</th>
              <th className="p-3">Guardian Name</th>
              <th className="p-3">Guardian Contact</th>
              <th className="p-3">Actions</th>
            </>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-100">
              <td className="p-3">{user.enrollmentNumber}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.firstName}</td>
              <td className="p-3">{user.lastName}</td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3">{new Date(user.dob).toLocaleDateString()}</td>
              <td className="p-3">{user.year}</td>
              <td className="p-3">{user.section}</td>
              <td className="p-3">{user.guardian?.name || "N/A"}</td>
              <td className="p-3">{user.guardian?.contact || "N/A"}</td>
              <td className="p-3">
                <button
                  onClick={() => handleEditClick(user)} // Trigger edit on button click
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="12" className="p-3 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default withRoleProtection(ManageUsers, ["teacher", "admin"]);
