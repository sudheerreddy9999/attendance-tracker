import jwt from "jsonwebtoken";

export const generateToken = (userId, email, userType,userName) => {
  console.log(userId, email, userType, userName," New Thing is ")
  return jwt.sign({ userId, email, userType,userName }, process.env.JWT_SECRET, { expiresIn: "1h" });
};


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
