const express = require("express")
const app = express();
const cookiesparser = require("cookie-parser")

//config file
const dotenv =  require("dotenv")
dotenv.config({path:"./config/config.env"})

app.use(express.json());
app.use(cookiesparser())

//db connection

const db = require("./db/conn");
db();




app.use("/api/v1",require("./router/routerproduct"));
app.use("/api/v2",require("./router/userRoute"))















app.listen(process.env.PORT, ()=>{
    console.log(`listening to server on http://localhost:${process.env.PORT}`)
})