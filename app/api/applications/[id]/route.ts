import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { ApplicationStatus, LocationType } from "@prisma/client";

const applicationSchema = z.object({
    role:z.string().min(1).optional(),
    status: z.enum(ApplicationStatus).optional(),
    jobUrl: z.url().optional(),
    source: z.string().min(1).optional(),
    locationType: z.enum(LocationType).optional(),
})

export async function GET(req: NextRequest, 
    { params }: { params: {id: string}}
){
    try{
        const decoded = await getUserFromRequest(req);
        const applicationId = params.id;

        const result = await prisma.application.findFirst({
            where: {
                id: applicationId,
                userId: decoded.userId,
            },
            include: {
                company:true,
            }
        });
        if(!result){
            return NextResponse.json(
                { message: "Application not found" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            {   message: "Fetched succesfully",
                result,
            },
            { status: 200 }
          );
    }catch(error){
        console.log(error);
        if(error instanceof Error && error.message === "Authentication Failed")
        return NextResponse.json(
            {message: "Authentication Failed"},
            {status: 401},
        )
    }
    return NextResponse.json(
        {message: "Internal server error"},
        {status: 500},
    )  
}

export async function PATCH(req: NextRequest, 
    { params }: {params: Promise<{id:string}>}){
    
    try{
        const decoded = await getUserFromRequest(req);
        const { id: applicationId } = await params;

        const body = await req.json();
        const result = applicationSchema.safeParse(body);

        if(!result.success){
            return NextResponse.json(
                {   message: "Invalid Input",
                    errors: z.flattenError(result.error).fieldErrors
                },
                {status: 400}
            )
        }

        
        if (Object.keys(result.data).length === 0) {
            return NextResponse.json(
            { message: "No fields provided for update" },
            { status: 400 }
            );
        }

        const existingApplication = await prisma.application.findFirst({
            where:{
                id: applicationId,
                userId: decoded.userId
            }
        })
        if(!existingApplication){
            return NextResponse.json(
                {message:"Application not found"},
                {status:404}
            )
        }
        const updatedApplication = await prisma.application.update({
            where:{
                id: applicationId,
            },
            data: result.data,
            include:{
                company:true,
            },
        })

        return NextResponse.json(
            {
              message: "Application updated successfully",
              application: updatedApplication,
            },
            { status: 200 }
          );
    }catch(error){
        console.log(error);
        if(error instanceof Error && error.message === "Authentication Failed"){
            return NextResponse.json(
                {message: "Authentication Failed"},
                {status: 401}
            );
        }
        return NextResponse.json(
            {message:" Internal server error"},
            {status: 500}
        )
    }

}

export async function DELETE(req:NextRequest,
    { params } : {params: Promise<{id: string}>}){

    try{
        const decoded = await getUserFromRequest(req);
        const { id: applicationId } = await params;

        const existingApplication = await prisma.application.findFirst({
            where:{
                id:applicationId,
                userId: decoded.userId,
            }
        })
        if(!existingApplication){
            return NextResponse.json(
                {messsage: "Application not Found"},
                {status:404}
            )
        }
        const deletedApplication = await prisma.application.delete({
            where:{
                id:applicationId,
            },
        });
        return NextResponse.json(
            {   message:"User deleted successfully",
                application: deletedApplication,
            },
            {status: 201}
        )
    } catch (error){
        console.log(error);
        if(error instanceof Error && error.message === "Authentication Failed"){
            return NextResponse.json(
                {message: "Authentication Failed"},
                {status: 401}
            );
        }
        return NextResponse.json(
            {message:" Internal server error"},
            {status: 500}
        )
    }

}