import connectMongoDB from "../../../../libs/mongodb";
import User from "@/models/users";
import { generateToken, verifyToken } from "@/libs/auth";
import bcrypt from "bcrypt";

export async function PUT(req) {
  try {
    // Retrieve ID from the request body
    const { id, email, password, userType, firstName, lastName, phone, dob, enrollmentNumber, year, section, guardian } = await req.json();

    // Ensure user ID is provided
    if (!id) {
      return new Response(
        JSON.stringify({ message: "User ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectMongoDB();

    // Check for authorization token in headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ message: "Authorization token missing or malformed" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.split(" ")[1];
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update user details
    user.email = email || user.email;
    user.userType = userType || user.userType;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.dob = dob || user.dob;
    user.enrollmentNumber = enrollmentNumber || user.enrollmentNumber;
    user.year = year || user.year;
    user.section = section || user.section;
    user.guardian = guardian || user.guardian;

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return new Response(
      JSON.stringify({ message: "User updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
