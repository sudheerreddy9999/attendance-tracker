import connectMongoDB from "../../../../libs/mongodb";
import User from "@/models/users";
import { generateToken, verifyToken } from "@/libs/auth";

export async function GET(req) {
  try {
    await connectMongoDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ message: 'Authorization token missing or malformed' }), { status: 401 });
    }

    const userDetails = verifyToken(authHeader.split(" ")[1]);

    if (userDetails.userType !== "teacher") {
        return new Response(JSON.stringify({ message: 'Not Authorized' }), { status: 401 });
    }

    const users = await User.find({ userType: "user" });

    return new Response(JSON.stringify({ users: users }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
