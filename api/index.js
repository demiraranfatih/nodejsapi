
//ana dizin
const express = require("express");
require("dotenv").config();
const app = express();
const { registerValidator } = require("./validators/registerValidators");
const { HomeController } = require("./controller/HomeController");
const { loginValidators } = require("./validators/loginValidators");
const { JWTController } = require("./controller/JWTController");
const userRouter = require("./routes/userroutes");

app.use(express.json());
//veritabanına erişmek için.
//const {init} =require("./dbconfig")
//init();
//apiya giden yol
//get

app.use("/user",JWTController.verifyAccessToken.bind(JWTController),userRouter)

app.get("/",(req,res)=>{
    res.send({message : "Hello you are all the best people"});
})
app.post(
"/register",
registerValidator,
HomeController.register
);
app.post(
    "/login",
    loginValidators,
    HomeController.login
    );

//post veritabanında veri kaydetmek için falan
app.post("/user",(req,res,next)=>{
    const body = req.body //burası bilgileri almak için yapılıyor bunun için yukarıda bir ara yazılım oluşturmam gerekiyor app.use(express.json()) gibi.
    res.send(body);
    console.log(body)
})
//sorgu için
app.get("/user",(req,res)=>{
    const {id} = req.query
    res.send({id: id})
})


app.get("/user/:id/username/:name",(req,res)=>{
    const {id,name} = req.params
    
    res.send({id: id, username : name});
})



app.listen(5000,()=>{
    console.log("Server running great");
})