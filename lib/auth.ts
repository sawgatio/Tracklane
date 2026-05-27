import { JwtPayload } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

interface UserPayload extends  JwtPayload{
    userId: string,
    email: string
}

export const getUserFromRequest = async(req:NextRequest) => {

    const header = req.headers.get("authorization");
    
    if(!header || !header.startsWith("Bearer ")){
        throw new Error ("Authentication failed");   
    }
    const token = header.split(" ")[1];
    try{
            const decoded = jwt.verify(
                token
            ,process.env.JWT_SECRET!) as UserPayload;

            return decoded;
            
    } catch(error){
        throw new Error ("Authentication failed");
    }
}