"use client";
import { useEffect, useState } from "react";
import withRoleProtection from "@/app/utils/withRoleProtection";
import { token } from "@/app/utils/token";

const updateAttendance = () => {
  const [users, setUsers] = useState([]);
  const [section, setSection] = useState("A");
  const [year, setYear] = useState("4");
  const [subject, setSubject] = useState("Computer Engineering");
  const [date, setDate] = useState("2024-02-08");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [isClient, setIsClient] = useState(false); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUsers = async () => {
    if (!isClient) return; // Prevent fetching on SSR

    console.log(token(), "Token value is ");
    console.log(section, subject, year, date);
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/attendance/studentsForAttend`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          section: section,
          year: year,
          authorization: `Bearer ${token()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data); // Assuming the data structure from your backend

      const initialAttendance = {};

      // Process the attendance data
      data.data.forEach(({ user, attendance }) => {
        const { firstName, lastName } = user;
        attendance.forEach((att) => {
          const yearlyData = att.attendance;
          Object.entries(yearlyData).forEach(([year, months]) => {
            Object.entries(months).forEach(([month, days]) => {
              Object.entries(days).forEach(([day, subjects]) => {
                Object.entries(subjects).forEach(([subject, isPresent]) => {
                  const attendanceDate = `${day}-${month}-${year}`;
                  // Initialize attendance for each user
                  if (!initialAttendance[user._id]) {
                    initialAttendance[user._id] = {};
                  }
                  initialAttendance[user._id][subject] = isPresent === "P" ? "Present" : "Absent";
                });
              });
            });
          });
        });
      });

      setAttendance(initialAttendance);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (userId, subject, status) => {
    const dates = date.split("-");
    const year = dates[0]; // Extract year
    const monthNumber = dates[1];
    const day = dates[2];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = monthNames[parseInt(monthNumber, 10) - 1];

    try {
      const payload = {
        userId,
        year,
        month,
        day,
        subject,
        status: status === "Present" ? "P" : "A", // Map Present/Absent to P/A
      };
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // If the server updates the attendance successfully, update the local state
        setAttendance((prevAttendance) => ({
          ...prevAttendance,
          [userId]: {
            ...prevAttendance[userId],
            [subject]: status, // Update the specific subject attendance status
          },
        }));
      } else {
        console.error("Failed to update attendance.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchUsers(); // Fetch users only when client-side rendering is done
    }
  }, [section, year, subject, date, isClient]);

  // Render nothing until the component is client-side
  if (!isClient) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex space-x-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a Section</option>
            <option value="CSE(A)">CSE(A)</option>
            <option value="CSE(B)">CSE(B)</option>
            <option value="CSE(C)">CSE(C)</option>
            <option value="A">A</option>
            <option value="ECE(B)">ECE(B)</option>
            <option value="EEE(A)">EEE(A)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a Subject</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Chemical Engineering">Chemical Engineering</option>
            <option value="Aerospace Engineering">Aerospace Engineering</option>
            <option value="Biomedical Engineering">Biomedical Engineering</option>
            <option value="Industrial Engineering">Industrial Engineering</option>
            <option value="Environmental Engineering">Environmental Engineering</option>
            <option value="Materials Science and Engineering">Materials Science and Engineering</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          onClick={() => fetchUsers()}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Find Class
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">Enrollment Number</th>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">Name</th>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">Section</th>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">Year</th>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user._id} className="hover:bg-gray-100">
                <td className="p-4 border-b">{user.user._id}</td>
                <td className="p-4 border-b">{user.user.firstName} {user.user.lastName}</td>
                <td className="p-4 border-b">{user.user.section}</td>
                <td className="p-4 border-b">{user.user.year}</td>
                <td className="p-4 border-b">
                  <select
                    value={attendance[user.user._id]?.[subject] || "Absent"}
                    onChange={(e) =>
                      handleAttendanceChange(user.user._id, subject, e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default withRoleProtection(updateAttendance, ["teacher", "admin"]);
