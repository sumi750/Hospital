const jwt = require("jsonwebtoken");

//Generating a Token
const generateToken = (userData)=>{

    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 5000});
}
// JWT Token Authentication
const jwtAuth = (req,res,next)=>{
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error:"Token not found or token is in valid"})

    // Extract the jwt token form the header
    const token = req.headers.authorization.split(' ')[1];

    if(!token) return res.status(401).json({ error: "Unauthorized"});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user information to the request object
        req.user = decoded;
        next();
    }
    catch(err){
        console.error(err);
        res.status(401).json({ error: "Invalid Token"});

    }

}

module.exports = {generateToken, jwtAuth};