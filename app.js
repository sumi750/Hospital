const express = require('express');
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3300;
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(bodyParser.json());

const mongoURL = "mongodb://127.0.0.1:27017/hospital";

main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log("Error", err);
})

async function main() {
    await mongoose.connect(mongoURL);
}

//Routing
const customerRouter = require("./routes/customerRouter.js");
app.use("/customer", customerRouter);

app.use("/", (req,res)=>{
    res.send("Welcome to Our HosPital");
})

app.listen(PORT, ()=>{
    console.log("Server is listining on port", PORT);
})