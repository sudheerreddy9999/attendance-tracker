"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentsPage = () => {
  const { token, userId, loading } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [formattedCurrentDate, setFormattedCurrentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [dates, setDates] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const date = new Date(formattedDate);
    const form = formatDateToCustomFormat(date);
    setFormattedCurrentDate(formattedDate);
    setSelectedDate(form);
  }, []);

  useEffect(() => {
    if (token && userId) {
      const fetchAttendance = async () => {
        try {
          const response = await fetch("/api/attendance/attendencesByUserId", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              userId: userId,
            },
          });
          const data = await response.json();
          const users = data?.users || [];
          setAttendanceData(users);
          const allDates = [];
          users.forEach((user) => {
            const { date } = user;
            if (!allDates.includes(date)) {
              allDates.push(date);
            }
          });
          setDates(allDates);

          // Prepare monthly data for the graph
          const monthlyStats = groupByMonth(users);
          setMonthlyData(monthlyStats);
        } catch (error) {
          console.error("Error fetching attendance data:", error);
        }
      };
      fetchAttendance();
    }
  }, [token, userId]);

  const getAttendanceForSelectedDate = () => {
    if (!attendanceData || !selectedDate) return [];
    return attendanceData.filter((user) => user.date === selectedDate);
  };

  const groupByMonth = (data) => {
    const monthsData = {};

    data.forEach((user) => {
      const date = new Date(user.date);
      const month = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const status = user.isPresent.toUpperCase();

      if (!monthsData[month]) {
        monthsData[month] = { present: 0, absent: 0 };
      }

      if (status === "P") {
        monthsData[month].present += 1;
      } else if (status === "A") {
        monthsData[month].absent += 1;
      }
    });

    return monthsData;
  };

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Present",
        data: Object.values(monthlyData).map((item) => item.present),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Absent",
        data: Object.values(monthlyData).map((item) => item.absent),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handlePrevious = () => {
    const currentIndex = dates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(dates[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = dates.indexOf(selectedDate);
    if (currentIndex < dates.length - 1) {
      setSelectedDate(dates[currentIndex + 1]);
    }
  };

  function formatDateToCustomFormat(date) {
    const months = [
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
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  }

  const handleDateChange = (event) => {
    const newSelectedDate = event.target.value; // 'YYYY-MM-DD' format
    if (newSelectedDate !== selectedDate) {
      const date = new Date(newSelectedDate);
      const formattedDate = formatDateToCustomFormat(date);
      setSelectedDate(formattedDate); // Only update if the date is different
    }
  };

  const handleDownload = () => {
    const attendanceForDate = getAttendanceForSelectedDate();
    if (!attendanceForDate || attendanceForDate.length === 0) {
      alert("No attendance data available for download.");
      return;
    }
    const data = attendanceForDate.map((user) => ({
      Date: user.date,
      Subject: user.subject,
      Status: user.isPresent,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const fileName = `Attendance_${selectedDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const attendanceForSelectedDate = getAttendanceForSelectedDate();

  return (
    <div className="flex items justify-center space-x-10 items-center p-4">
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Student Attendance Data
        </h1>

        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handlePrevious}
            disabled={dates[0] === selectedDate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Previous
          </button>
          <input
            type="date"
            onChange={handleDateChange}
            value={selectedDate}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleNext}
            disabled={dates[dates.length - 1] === selectedDate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Next
          </button>
        </div>

        {selectedDate && (
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Date: {selectedDate}
            </h3>
            <table className="min-w-full border border-gray-200 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">
                    Subject
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceForSelectedDate.length > 0 ? (
                  attendanceForSelectedDate.map((user, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border-b text-gray-700">
                        {user.date}
                      </td>
                      <td className="px-4 py-2 border-b text-gray-700">
                        {user.subject}
                      </td>
                      <td className="px-4 py-2 border-b text-gray-700">
                        {user.isPresent === "P" ? "Present" : "Absent"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No data available for this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              onClick={handleDownload}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Download Attendance as Excel
            </button>
          </div>
        )}
      </div>
      <div>
        <div className="w-full max-w-lg mt-32 bg-white shadow-lg rounded-lg p-6 mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Monthly Attendance
          </h3>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
