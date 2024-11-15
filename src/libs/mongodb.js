import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to MongoDB");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI|| "mongodb+srv://sudheerjanga9999:MIiVMJSjK7bgIfpv@cluster0.xfdw4.mongodb.net/tracker_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectMongoDB;
