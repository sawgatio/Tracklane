import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";


interface UserPayload extends JwtPayload {
    userId: string;
    email: string
}

export async function GET(req:NextRequest){
    const header = req.headers.get("authorization");
    
    if(!header || !header.startsWith("Bearer ")){
        return NextResponse.json(
            {message:"Header doesn't exist"},
            {status:401}
        );
    }
    const token = header.split(" ")[1];
    try{
            const decoded = jwt.verify(
                token
            ,process.env.JWT_SECRET!) as UserPayload;

            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.userId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });

            if(!user){
                return NextResponse.json(
                    { message: "User not found"},
                    { status: 404}
                );
            }
        
            return NextResponse.json({
                user,
            });
    } catch(error){
        console.log(error)
        return NextResponse.json(
            {message: "Invalid or expired token"},
            {status: 401}
        )
    }


}