
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { error } from "console";

const signinSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6,"Password must be at least 6 characters"),
});

export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        const result = signinSchema.safeParse(body);
        if(!result.success){
            return NextResponse.json({
                message: "Invalid input",
                error:z.flattenError(result.error).fieldErrors,
            },
            {status: 400});
        }

        const {email,password} = result.data;
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
            },
        });

        if(!existingUser){
            return NextResponse.json(
                {message:"Invalid credentials"},
                {status: 401}
            );
        }

        const isPasswordValid = await bcrypt.compare(password,existingUser.passwordHash);

        if(!isPasswordValid){
            return NextResponse.json(
                {message:"Invalid credentials"},
                {status: 401}
            );
        }

        const token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email,
            },
        process.env.JWT_SECRET!,
        {expiresIn: "1d"});

        console.log(token)
        return NextResponse.json(
            {
                message: "Signin successful",
                token,
                user: {
                    id: existingUser.id,
                    name: existingUser.name,
                    email:existingUser.email,
                },
            },
            {status: 200}
        );

    }catch(error){
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
} 
