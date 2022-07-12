const mongoose = require ("mongoose");


const connection = async()=>{
   await mongoose.connect(process.env.DB).then(
        console.log("connecting to db......")
    ).catch((err)=>{
        console.log(err)

    })
    
}



module.exports = connection;

