import Attendance from "@/models/attendance";
import connectMongoDB from "../../../libs/mongodb";
export async function POST(req) {
  await connectMongoDB();

  try {
    const { userId, year, month, day, subject, status } = await req.json();
    if (!userId) {
      console.error("Error: userId is missing or invalid.");
      return new Response(
        JSON.stringify({ message: "userId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatePath = `attendance.${year}.${month}.${day}.${subject}`;
    const userDetails = await Attendance.find({ userId: userId });

    let result;
    if (userDetails.length > 0) {
      result = await Attendance.findOneAndUpdate(
        { userId },
        { $set: { [updatePath]: status } },
        { upsert: true, new: true }
      );
    } else {
      const data ={
        userId ,
        attendance: { [year]: { [month]: { [day]: { [subject]: status } } } },
      }
      result = await Attendance.create(data);
    }

    return new Response(
      JSON.stringify({ message: "Attendance updated successfully", result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating attendance:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
