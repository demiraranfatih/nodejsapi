const bcyrpt = require("bcrypt");
const {body, validationResult} = require("express-validator");
const { connect,close } = require("../dbconfig");
const { User } = require("../models/User");
const { userResponseParser } = require("../parser/userResponseParser");
const { JWTController } = require("./JWTController");
const { UserController } = require("./UserController");

exports.HomeController = {
    async register(req,res){


        await connect()
        
        let user = await UserController.getUserByEmail(req.body.email);
        if(user)
            return res.status(400).json({errors : {msg : 'user account already exists'}});
    
        const hashedPassword = bcyrpt.hashSync(req.body.password,10)
    
        user = await User.create({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            password : hashedPassword,
            contact : req.body.contact
        })

        const token =JWTController.createToken({email : user.email},true)
        res.cookie("refresh_token",token.refresh_token,{
            expires : new Date(Date.now()+30*24*3600000),
            httpOnly : true,
        });
        
        //close()
        res.send({...userResponseParser(user),acces_token : token.acces_token});
        // res.send(user);
},
async login(req,res){


    await connect()
    
    let user =  await UserController.getUserByEmail(req.body.email);
    if(!user)
        return res.status(400).json({errors : {msg : 'Please Register'}});

    
        if(bcyrpt.compareSync(req.body.password,user.password))
        {
            const token =JWTController.createToken({email : user.email},true)
        res.cookie("refresh_token",token.refresh_token,{
            expires : new Date(Date.now()+30*24*3600000),
            httpOnly : true,
        });
        res.send({...userResponseParser(user),acces_token : token.acces_token});
    // res.send({id:user.id,email:user.email,firstname:user.firstname})
        }
    
    else
    res.status(400).json({errors : {msg : 'Incorrect password'}});
}
}