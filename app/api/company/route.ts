import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";


const companySchema = z.object({
    name: z.string().min(1,"Enter your Company name"),
    website:z.url()
})

export async function POST(req: NextRequest){
    try{
        const decoded = await getUserFromRequest(req);
        const body = await req.json();
        const result = companySchema.safeParse(body);
    
        if(!result.success){
            return NextResponse.json(
                {   message:"Validation failed",
                    errors: z.flattenError(result.error).fieldErrors
                },
                {status:400}
            )
        }

        const { name, website } = result.data;

        const companies = await prisma.company.findFirst({
            where: {
              userId: decoded.userId,
              name,
              website: website,
            },
          });

          if(companies) {
            return NextResponse.json(
              {
                message: "Company already exists",
                company: companies,
              },
              { status: 409 }
            );
          }
      

        const RealCompany = await prisma.company.create(
            {
                data:{
                    name,
                    website,
                    userId: decoded.userId
                }
            }
        )
        return NextResponse.json(
            {   message: "Company created successfully",
                RealCompany,
            },

            {status:201}
        )


    } catch (error){
        console.log(error);

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
        
        const companies = await prisma.company.findMany(
            {
                where:{
                    userId: decoded.userId
                },orderBy:{
                    createdAt: "desc"
                }
                
            });

        return NextResponse.json(
            {   message: "Companies fetched successfully",
                companies,
            },
            {status: 200},
        )    
    } catch(error){
        console.log(error);
        if(error instanceof Error && error.message === "Authentication failed"){
            return NextResponse.json(
                {message:"Authentication failed"},
                {status: 401}
            )
        }
        return NextResponse.json(
            {message:"Internal server error"},
            {status:500}
        )
    }

}