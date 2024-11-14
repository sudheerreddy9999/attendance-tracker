import connectMongoDB from "../../../../libs/mongodb";
import Attendance from "@/models/attendance";
import transformAttendance from "@/app/utils/commonUtil";
// import User from "@/models/users";
// import { verifyToken } from "@/libs/auth";

export async function GET(req) {
  try {
    await connectMongoDB();
    const userId = req.headers.get("userId");
    // const authHeader = req.headers.get('authorization');
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return new Response(JSON.stringify({ message: 'Authorization token missing or malformed' }), { status: 401 });
    // }

    // const userDetails = verifyToken(authHeader.split(" ")[1]);

    // if (userDetails.userType !== "teacher") {
    //     return new Response(JSON.stringify({ message: 'Not Authorized' }), { status: 401 });
    // }

    const users = await Attendance.find({ userId: userId });
    const attendanceData = transformAttendance(users)
    return new Response(
        JSON.stringify({ message: "Attendance Data", users: attendanceData }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
