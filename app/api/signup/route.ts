import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z }  from "zod"

const signupSchema = z.object({
    name: z.string().min(3,"Name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password:z.string().min(6,"Password must be at least 6 characters"),
});

export async function POST(req:Request){
    try{
        const body = await req.json();
        const result = signupSchema.safeParse(body);

        if(!result.success){
            return NextResponse.json({
                message: "Invalid input",
                errors: z.flattenError(result.error).fieldErrors,
            },
        {status:400});
        }

        const { name, email, password } = result.data;
        const existingUser = await prisma.user.findUnique({
            where: {email}
        });

        if(existingUser){
            return NextResponse.json(
                {message: "User alreadt exists"},
                {status: 409}
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user,
            },
            { status: 201}
        );
    }catch (error) {
        console.error(error);
        return NextResponse.json(
            {message: "Internal server error "},
            { status : 500}
        );
    }
    
}