const express = require("express");
const router =  express.Router();
const Customer = require("../models/customer.js");
const bcrypt = require("bcryptjs");
const {generateToken, jwtAuth} = require("./../models/jwt.js");
const jwt = require("jsonwebtoken");

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
        res.cookie('jwt', token, { httpOnly: true, secure: true });
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
        res.cookie('jwt', token, { httpOnly: true, secure: true });
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

module.exports = router;