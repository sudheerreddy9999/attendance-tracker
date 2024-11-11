import connectMongoDB from "../../../../libs/mongodb";
import User from "@/models/users";
import { generateToken } from "@/libs/auth";

export async function POST(req) {
  console.log("hello Sudheer How are you")
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password are required" }), { status: 400 });
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    const token = generateToken(newUser._id);

    return new Response(
      JSON.stringify({ message: "User created", token }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
