import connectMongoDB from "../../../../libs/mongodb";
import User from "@/models/users";
import bcrypt from "bcrypt";

export async function PUT(req) {
    try {
        const {previousPassword,password,email} = await req.json();
        if (!previousPassword || !password ||!email) {
            return new Response(
              JSON.stringify({ message: "Required fields are missing" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          } 
          await connectMongoDB();
          const userInfo = await User.findOne({email:email})
          const compared = await bcrypt.compare(previousPassword,userInfo.password)
          if(!compared){
            return new Response(
                JSON.stringify({ message: "Invalid Previous password" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          await User.updateOne({ email: email }, { password: hashedPassword });
          return new Response(
            JSON.stringify({ message: "Password updated successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        
    }
}