import { redis } from "../lib/redis.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken";

//create a token 
const generateToken = (userId)=>{
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId } , process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken }
}

//store refresh token
const storeRefreshToken = async( userId, refreshToken )=>{
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7*24*60*60);
}

//save cookies
const setCookies = (res, accessToken, refreshToken)=>{
    res.cookie("access-token", accessToken, {
        httpOnly: true, //prevent xxs attacks
        secure:process.env.NODE_ENV === "production",
        sameSite: "strict", //prevents CSRF attack, cross site request forgery attack
        maxAge: 15 * 60 * 1000, // is mintes
    })
    res.cookie("refresh-token", refreshToken, {
        httpOnly: true, //prevent xxs attacks
        secure:process.env.NODE_ENV === "production",
        sameSite: "strict", //prevents CSRF attack, cross site request forgery attack
        maxAge: 7 * 24 * 60 * 1000, // 7days mintes
    });
};


export const signup = async (req, res)=>{
    const {email, password, name} = req.body

    try{
        const userExists = await User.findOne({ email })
        if (userExists){
            return res.status(400).json({
                message: "User already exists;"

            })
        }
        
        const user = await User.create({
            name,
            email, 
            password
        })

        //authenticate
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }, 
            message: "User created "
        })
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}


export const login = async (req, res)=>{
    res.send("login")
}
export const logout = async (req, res)=>{
    res.send("logout")
}