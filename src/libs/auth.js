import jwt from "jsonwebtoken";

export const generateToken = (userId, email, userType,userName) => {
  return jwt.sign({ userId, email, userType,userName }, process.env.JWT_SECRET || "my_super_secret_key_7881", { expiresIn: "1h" });
};


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "my_super_secret_key_7881");
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
