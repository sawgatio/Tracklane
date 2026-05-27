import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


const companySchema = z.object({
    name: z.string().min(1,"Enter your Company name"),
    website:z.url()
})

export async function POST(req: NextRequest){
    try{
        await getUserFromRequest(req);
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

        const existingCompany = await prisma.company.findFirst({
            where: {
              name,
              website: website ?? null,
            },
          });

          if (existingCompany) {
            return NextResponse.json(
              {
                message: "Company already exists",
                company: existingCompany,
              },
              { status: 409 }
            );
          }
      

        const RealCompany = await prisma.company.create(
            {
                data:{
                    name,
                    website,
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