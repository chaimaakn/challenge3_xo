const mongoose=require("mongoose");

async function ConnectDb(url){
   await mongoose.connect(url,
    {
        dbName:"Users",

    }
   );

   console.log("connected to the database");
}

module.exports=ConnectDb;