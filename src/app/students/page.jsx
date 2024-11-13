"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as XLSX from "xlsx"; // Importing XLSX library for Excel export

const StudentsPage = () => {
    const { token, userId, loading } = useAuth();
    const [attendanceData, setAttendanceData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dates, setDates] = useState([]);

    if (loading) {
        console.log("Token is loading...");
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    useEffect(() => {
        if (typeof window !== "undefined" && token && userId) {
            const fetchAttendance = async () => {
                try {
                    const response = await fetch("/api/attendance/attendencesByUserId", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            "userId": userId,
                        },
                    });
                    const data = await response.json();
                    const attendance = data.users[0].attendance;
                    setAttendanceData(attendance);

                    // Flatten dates for easier navigation in `DD-MMM-YYYY` format
                    const allDates = [];
                    Object.entries(attendance).forEach(([year, months]) => {
                        Object.entries(months).forEach(([month, days]) => {
                            Object.entries(days).forEach(([day]) => {
                                const formattedDate = `${day}-${month}-${year}`;
                                allDates.push(formattedDate);
                            });
                        });
                    });
                    setDates(allDates);
                    setSelectedDate(allDates[0]);
                } catch (error) {
                    console.error("Error fetching attendance data:", error);
                }
            };
            fetchAttendance();
        }
    }, [token, userId]);

    const getAttendanceForSelectedDate = () => {
        if (!attendanceData || !selectedDate) return null;
        const [day, month, year] = selectedDate.split("-");
        return attendanceData[year]?.[month]?.[day] || null;
    };

    const handlePrevious = () => {
        const currentIndex = dates.indexOf(selectedDate);
        if (currentIndex > 0) setSelectedDate(dates[currentIndex - 1]);
    };

    const handleNext = () => {
        const currentIndex = dates.indexOf(selectedDate);
        if (currentIndex < dates.length - 1) setSelectedDate(dates[currentIndex + 1]);
    };

    const handleDateChange = (event) => {
        const date = new Date(event.target.value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
        const year = date.getFullYear().toString();
        const formattedDate = `${day}-${month}-${year}`;

        // Check if the selected date has data
        if (dates.includes(formattedDate)) {
            setSelectedDate(formattedDate);
        } else {
            alert("No data available for this date.");
        }
    };

    const handleDownload = () => {
        const attendanceForDate = getAttendanceForSelectedDate();

        if (!attendanceForDate) {
            alert("No attendance data available for download.");
            return;
        }

        const data = Object.entries(attendanceForDate).map(([subject, status]) => ({
            Date: selectedDate, 
            Subject: subject,
            Status: status,
        }));

        // Create a worksheet from the data
        const ws = XLSX.utils.json_to_sheet(data);

        // Create a new workbook and append the worksheet to it
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance");

        // Generate an Excel file and prompt the user to download
        const fileName = `Attendance_${selectedDate}.xlsx`; // Filename with the selected date
        XLSX.writeFile(wb, fileName);
    };

    const attendanceForSelectedDate = getAttendanceForSelectedDate();

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Student Attendance Data</h1>

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
                                <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">Date</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">Subject</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceForSelectedDate ? (
                                Object.entries(attendanceForSelectedDate).map(([subject, status]) => (
                                    <tr key={subject}>
                                        <td className="px-4 py-2 border-b text-gray-700">{selectedDate}</td> {/* Date column */}
                                        <td className="px-4 py-2 border-b text-gray-700">{subject}</td>
                                        <td className="px-4 py-2 border-b text-gray-700">{status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                                        No data available for this date.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Download Attendance as Excel
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;
