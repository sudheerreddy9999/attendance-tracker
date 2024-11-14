import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import Attendance from "@/models/attendance";
import { verifyToken } from "@/libs/auth";
import transformAttendance from "@/app/utils/commonUtil";
export async function GET(req) {
  await connectMongoDB();

  try {
    const section = req.headers.get("section");
    const year = req.headers.get("year");

    // Step 1: Find users based on section and year
    const users = await User.find({ section, year });

    if (!users.length) {
      return new Response(
        JSON.stringify({
          message: "No users found for the given section and year",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 2: Get the userIds of the users and fetch attendance data for each user
    const usersData = await Promise.all(
      users.map(async (user) => {
        const userId = user._id;
        // Fetch attendance data for each user
        const attendanceData = await Attendance.find({ userId });
        const data = await transformAttendance(attendanceData);

        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          section: user.section,
          year: user.year,
          enrollmentNumber: user.enrollmentNumber,
          attendance: data,
        };
      })
    );

    return new Response(
      JSON.stringify({
        message: "Users and attendance fetched successfully",
        data: usersData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching users and attendance:", error.message);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
