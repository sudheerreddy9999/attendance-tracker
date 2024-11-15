"use client";

import { useEffect, useState } from "react";
import withRoleProtection from "@/app/utils/withRoleProtection";
import { token } from "@/app/utils/token";
import * as XLSX from "xlsx";

const updateAttendance = () => {
  const [users, setUsers] = useState([]);
  const [section, setSection] = useState("A");
  const [year, setYear] = useState("4");
  const [subject, setSubject] = useState("Computer Engineering");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
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
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${day}-${monthName}-${year}`;
  };

  const fetchUsers = async () => {
    if (!isClient) return;

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
      setUsers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (userId, date, subject, status) => {
    const dates = date.split("-");
    const year = dates[0];
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
        status: status === "P" ? "P" : "A",
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
        fetchUsers()
        setAttendance((prevAttendance) => {
          const updatedAttendance = { ...prevAttendance };
          if (!updatedAttendance[userId]) {
            updatedAttendance[userId] = {};
          }
          if (!updatedAttendance[userId][date]) {
            updatedAttendance[userId][date] = {};
          }
          updatedAttendance[userId][date][subject] =
            status === "P" ? "P" : "A";
          return updatedAttendance;
        });
      } else {
        console.error("Failed to update attendance.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchUsers();
    }
  }, [section, year, subject, date, isClient]);

  if (!isClient) {
    return null;
  }
  const downloadExcel = () => {
    const data = users.map((user) => ({
      "Enrollment Number": user.enrollmentNumber,
      Name: `${user.firstName} ${user.lastName}`,
      Section: user.section,
      Subject: subject,
      Year: user.year,
      Attendance: user.attendance.find(
        (record) => record.date === formatDate(date) && record.subject === subject
      )?.isPresent || "None",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_records.xlsx");
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex space-x-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Section
          </label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="A">A</option>
            <option value="CSE(A)">CSE(A)</option>
            <option value="CSE(B)">CSE(B)</option>
            <option value="CSE(C)">CSE(C)</option>
            <option value="ECE(B)">ECE(B)</option>
            <option value="EEE(A)">EEE(A)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Mechanical Engineering">
              Mechanical Engineering
            </option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Electrical Engineering">
              Electrical Engineering
            </option>
            <option value="Chemical Engineering">Chemical Engineering</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Year
          </label>
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
        <button
          onClick={downloadExcel}
          className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Download Excel
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
              <th className="p-4 text-left text-gray-700 font-semibold border-b">
                Enrollment Number
              </th>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">
                Name
              </th>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">
                Section
              </th>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">
                Subject
              </th>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">
                Year
              </th>
              <th className="p-4 text-left text-gray-700 font-semibold border-b">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const attendanceRecord = user.attendance.find(
                (record) =>
                  record.date === formatDate(date) && record.subject === subject
              );
              return (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="p-4 border-b">{user.enrollmentNumber}</td>
                  <td className="p-4 border-b">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="p-4 border-b">{user.section}</td>
                  <td className="p-4 border-b">{subject}</td>
                  <td className="p-4 border-b">{user.year}</td>
                  <td className="p-4 border-b">
                    <select
                      value={attendanceRecord?.isPresent}
                      onChange={(e) =>
                        handleAttendanceChange(
                          user._id,
                          date,
                          subject,
                          e.target.value
                        )
                      }
                      className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option defaultChecked>None</option>
                      <option value="P">Present</option>
                      <option value="A">Absent</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default withRoleProtection(updateAttendance, ["admin","teacher"]);
