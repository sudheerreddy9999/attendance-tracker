import connectMongoDB from "../../../../libs/mongodb";
import User from "@/models/users";
import { generateToken, verifyToken } from "@/libs/auth";

export async function POST(req) {
  try {
    const {
      email,
      password,
      userType,
      firstName,
      lastName,
      phone,
      dob,
      enrollmentNumber,
      year,
      section,
      guardian,
    } = await req.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !enrollmentNumber || !year) {
      return new Response(
        JSON.stringify({ message: "Required fields are missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectMongoDB();

    // Verify the Authorization token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ message: "Authorization token missing or malformed" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log(authHeader," Auth Header Value is ")
    const token = authHeader.split(" ")[1];
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user already exists by email or enrollment number
    const existingUser = await User.findOne({ $or: [{ email }, { enrollmentNumber }] });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User with this email or enrollment number already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const newUser = new User({
      email,
      password,
      userType,
      firstName,
      lastName,
      phone,
      dob,
      enrollmentNumber,
      year,
      section,
      guardian,
    });
    
    await newUser.save();

    const newToken = generateToken(newUser._id, newUser.email, newUser.userType);

    return new Response(
      JSON.stringify({ message: "User created", token: newToken }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in creating user:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
