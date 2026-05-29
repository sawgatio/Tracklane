
import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus } from "@prisma/client";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

const applicationSchema = z.object({
    companyId: z.string().min(1, "Company id is required"),
    role: z.string().min(1,"Role is required"),
    status: z.enum(ApplicationStatus)
});

export async function POST(req:NextRequest){
    try{
        const decoded = await getUserFromRequest(req);
        const body = await req.json();
        const result = applicationSchema.safeParse(body);
        
        if(!result.success){
            return NextResponse.json(
                {   message: "Validation failed",
                    errors: z.flattenError(result.error).fieldErrors,
                }, 
                {status: 400}
            )
        };

        const { companyId, role, status} = result.data;
        const company = await prisma.company.findUnique({
            where: {
                id: companyId,
            },
        });

        if(!company){
            return NextResponse.json(
                {message: "Company not found"},
                {status: 404}
            );
        }
        const application = await prisma.application.create
        ({
            data: { 
                companyId,              
                role,
                status,
                userId: decoded.userId,
                },
            },
        );

        return NextResponse.json(
            {
                message: "Application created successfully",
                application,
            },
            {status: 201}
        );
        
    } catch(error){
        console.log(error)
        if(error instanceof Error && error.message === "Authentication failed"){
            return NextResponse.json(
                {message: "Authentication failed"},
                {status: 401}
            );
        }
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        );
    }
}

export async function GET(req:NextRequest){
    try{
        const decoded = await getUserFromRequest(req);
    
        const applications = await prisma.application.findMany({
            where:{
                userId: decoded.userId
            },include: {
                company: true,
            },orderBy:{
                createdAt: "desc"
            }
        });

        return NextResponse.json(
            {   message: "Fetched successfully",
                applications,
            },
            {status:200}
        )
    }catch (error){
        console.log(error);
        if(error instanceof Error && error.message === "Authentication failed"){
            return NextResponse.json(
                {message:"Authentication failed"},
                {status: 401}
            );
        }
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    }
}