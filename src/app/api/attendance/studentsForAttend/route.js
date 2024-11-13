import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import Attendance from "@/models/attendance";
import { verifyToken } from "@/libs/auth";

// export async function GET(req) {
//   try {
//     await connectMongoDB();
//     const section = req.headers.get("section");
//     const year = req.headers.get("year");
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return new Response(JSON.stringify({ message: 'Authorization token missing or malformed' }), { status: 401 });
//     }

//     const userDetails = verifyToken(authHeader.split(" ")[1]);

//     if (userDetails.userType !== "teacher") {
//         return new Response(JSON.stringify({ message: 'Not Authorized' }), { status: 401 });
//     }

//     const users = await User.find({ section: section,year:year });

//     return new Response(JSON.stringify({ users: users }), { status: 200 ,headers: { "Content-Type": "application/json" }});

//   } catch (error) {
//     console.error(error);
//     return new Response(
//       JSON.stringify({ message: "Internal server error" }),
//       { status: 500 }
//     );
//   }
// };


// import User from "@/models/user";         // Assuming the User model path is correct
// import Attendance from "@/models/attendance"; // Assuming the Attendance model path is correct
// import connectMongoDB from "../../../libs/mongodb";
// import User from "@/models/user";
// import Attendance from "@/models/attendance";
// import connectMongoDB from "../../../libs/mongodb";

// import User from "@/models/user";
// import Attendance from "@/models/attendance";
// import connectMongoDB from "../../../libs/mongodb";

export async function GET(req) {
  await connectMongoDB();

  try {
    // Destructure section and year from the request body
    const section = req.headers.get("section");
    const year = req.headers.get("year");

    // Step 1: Find users based on section and year
    const users = await User.find({ section, year });

    if (!users.length) {
      return new Response(
        JSON.stringify({ message: "No users found for the given section and year" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 2: Get the userIds of the users and fetch attendance data for each user
    const usersData = await Promise.all(
      users.map(async (user) => {
        const userId = user._id;
        // Fetch attendance data for each user
        const attendanceData = await Attendance.find({ userId });
        return {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            section: user.section,
            year: user.year
          },
          attendance: attendanceData
        };
      })
    );

    // Step 3: Return the response with both user and attendance data
    return new Response(
      JSON.stringify({
        message: "Users and attendance fetched successfully",
        data: usersData
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching users and attendance:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}




