import mongoose from "mongoose";

const connectToDb =async (url,server)=>{
    try{
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      
    });
    console.log("Connected to database...");
    //== call server ==
    server();
}catch(err){
    console.log(err);
}
}

export default connectToDb;