const express= require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

const authenticateToken = (req,res,next)=>{
    try {
        const token = req.headers['authorization'];
    if(!token){
        return res.sendStatus(401) //No token found!
    }
    
    jwt.verify(token,secretKey,(err,user)=>{
        if(err){
            return res.sendStatus(403); //Toke is Invalid!
        }
        req.user=user;
        next();
    })
    } catch (error) {
        console.error("Failed to Login",error);
        throw error;
        
    }
}

module.exports = authenticateToken;
