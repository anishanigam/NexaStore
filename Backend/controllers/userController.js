import userModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const createToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET)
}

//Route for user login
const loginUser = async(req,res) => {
    try{
        const {email , password} = req.body;

        console.log("Trying to login with:", email);



        const user = await userModel.findOne({
            email
        }) ;  
        console.log("Found user:", user);   
        if(!user){
            return res.json({success:false , message : "User not found"})
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(isMatch){
            const token = createToken(user._id);
            res.json({success:true , token})
        } else {
            res.json({success:false , message : "Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false , message : error.message})
    }
    
}

//route for register user
const registerUser = async (req,res) => {
    try {
        const {name , email , password} = req.body;

        const exists = await userModel.findOne({
            email
        })

        if(exists){
            return res.json({success:false , message : "User already exists"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false , message : "Invalid email"})
        }

        if(password.length < 8){
            return res.json({success:false , message : "Password should be atleast 8 characters"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = new userModel({
            name,
            email,
            password : hashedPassword
        })

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({success:true , token})


    } catch (error) {
        console.log(error);
        res.json({ success: false , message : error.message})
    }
    
}

//route for admin login
const adminLogin = async (req,res) => {
    try {
        const {email,password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            // const token = jwt.sign(email+password , process.env.JWT_SECRET);
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            
            
            res.json({success:true , token})
        }
        else{
            res.json({success:false,message: "Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
        
    }

}


export {loginUser , registerUser , adminLogin}