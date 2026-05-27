import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth"



export async function GET(req:NextRequest){

    try{
            const decoded = await getUserFromRequest(req);
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

            if(!user || user == null){
                return NextResponse.json(
                    {message: "User not found"},
                    {status:404}
                )
            }
        
            return NextResponse.json({
                user,
            });
        }
    catch(error){
        console.log(error);
        if (error instanceof Error && error.message === "Authentication failed")
        return NextResponse.json(
            {message: error.message},
            {status: 401}
        )
        console.error("Profile route error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
          );
    }  
    

}