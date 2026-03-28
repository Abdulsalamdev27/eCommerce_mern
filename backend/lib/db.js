import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
       const conn =  await mongoose.connect(process.env.MONGO_URI)
       console.log(`mongoDB connected: ${conn.connection.host}`)
    }catch(error){
        // res.json({
        //     status: 500,
        //     message: "Error connecting to MONGODB",
        // })
        console.log("Error connecting to MONGODB", error.message)
        process.exit(1);

    }
}