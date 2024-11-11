import jwt from "jsonwebtoken";

export const generateToken = (userId,email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
