const express = require("express");
const router =  express.Router();
const Customer = require("../models/customer.js");
const bcrypt = require("bcryptjs");
const {generateToken, jwtAuth} = require("./../models/jwt.js");
const jwt = require("jsonwebtoken");
const blacklist = [];

//Middle Ware

router.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token && blacklist.includes(token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
});


//SignUp
router.post("/signup", async(req,res)=>{
    try{
        const { name, age, phone, email, password} = req.body;
        if(!name || !age ||  !phone || !email || !password){
            res.status(400).json({message: "Field is Missing"});
        }

        const existUser = await Customer.findOne({email});
        if(existUser){
            return res.status(400).json({message: "User Already Exist"});
        }

        //Hash The password
        const hashPass = await bcrypt.hash(password, 10);
        
        const customerId = Math.floor(Math.random() * 1000000);

        const newCustomer = new Customer({
            name, age, phone, email, password : hashPass, customerId
        });

        await newCustomer.save();
        console.log(newCustomer);

        //generate JWT 
        const payload = {
            customerId : newCustomer.customerId,
            password : newCustomer.password,
        }

        const token = generateToken(payload);

        // let oldTokens = newCustomer.tokens || []

        // if(oldTokens.length){
        //     oldTokens = oldTokens.filter(t=>{
        //         const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
        //         if(timeDiff < 86400){
        //             return t;
        //         }
        //     })
        // }

        // await Customer.findByIdAndUpdate(newCustomer._id, {tokens: [...oldTokens, {token, signedAt: Date.now().toString()}]});
        res.status(201).json({message: "Customer Created Seccuessfully", customerId, token : token});

    }
    catch(err){
            res.status(500).json({message: "Server error"});
    }
});


//Login
router.post("/login", async (req,res)=>{
    try{
        const {password, customerId} = req.body;
        const customer = await Customer.findOne({customerId});
        if(!customer){
            return res.status(401).json({message: "Invalid customer id or password"});
        }

        //generate Token
        const payload = {
            password : customer.password
        }

        const token = generateToken(payload);

        // let oldTokens = customer.tokens || []

        // if(oldTokens.length){
        //     oldTokens = oldTokens.filter(t=>{
        //         const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
        //         if(timeDiff < 86400){
        //             return t;
        //         }
        //     })
        // }

        // await Customer.findByIdAndUpdate(customer._id, {tokens: [...oldTokens, {token, signedAt: Date.now().toString()}]});

        //compare passwords

        const isMatch = await bcrypt.compare(password, customer.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid password"});
        }

        res.status(200).json({message: "Login Succefull", customerId : customer.customerId, token: token});
    }
    catch(err){
        res.status(500).json({message: "Server Error"});
    }
});


//LogOut Api
router.post("/logout", async(req,res)=>{
    try{

    
       const token =  req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({success : false, message: "Authorzation fails"});
        }

        if(token){
            blacklist.push(token);
        }
        
        res.json({message : "Sign Out "});
    }
    catch(err){
        res.status(500).json("Error")
    }
})

module.exports = router;