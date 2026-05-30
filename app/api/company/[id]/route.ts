import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

const companySchema = z.object({
    name: z.string().min(1,"Enter your Company name").optional(),
    website:z.url().optional(),
})

export async function PATCH(req: NextRequest,
    {params}: {params: Promise<{id: string}>}
){
    try{
            const decoded = await getUserFromRequest(req);
            const { id: companyId } = await params;
        
            const body = await req.json();
            const result = companySchema.safeParse(body);
        
            if(!result.success){
                return NextResponse.json(
                    {   message:"Invalid body",
                        errors:z.flattenError(result.error).fieldErrors
                    },
                    
                    {status: 400}
                )
            }
            const existingCompany = await prisma.company.findFirst({
                where:{
                    id: companyId,
                    userId:decoded.userId,
                },
            });

            if(!existingCompany){
                return NextResponse.json(
                    {message: "Company not found"},
                    {status: 404}
                );
            }

            const updatedCompany = await prisma.company.update({
                where:{
                    id:companyId, 
                }, 
                data: result.data,
            });
            return NextResponse.json(
                {
                message: "Company updated successfully",
                company: updatedCompany,
                },
                { status: 200 }
            );
    }catch(error){
        console.log(error);
        if(error instanceof Error && error.message === "Authentication failed"){
            return NextResponse.json(
                {message: "Authentication failed"},
                {status: 401}
            );
        }
        return NextResponse.json(
            {message:"Internal server error"},
            {status: 500}
        )
    }


}

export async function DELETE(req:NextRequest,
    {params}:{params: Promise<{id:string}>}
){
    try{

        const decoded = await getUserFromRequest(req);
        const { id: companyId } = await params;

        const existingCompany = await prisma.company.findFirst({
            where: {
                id: companyId,
                userId: decoded.userId,
            }
        })
        if(!existingCompany){
            return NextResponse.json(
                {message: "Company not found"},
                {status: 404}
            )
        };

        const deletedCompany = await prisma.company.delete({
            where:{
                id: companyId,       
            }
        });
        
        return NextResponse.json(
            {   message:"Company deleted successfully",
                deletedCompany
            },
            {status:200}
        )

    }catch (error){
        console.log(error);
        if(error instanceof Error && error.message === "Authentication failed"){
            return NextResponse.json(
                {message: "Authentication failed"},
                {status: 401}
            );
        }
        return NextResponse.json(
            {message:"Internal server error"},
            {status: 500}
        )
    }
}