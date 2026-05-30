"use client"
import React, {  SubmitEventHandler, useState } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage(){
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

   const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const res = await fetch("http://localhost:3000/api/signin",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email,password}),
            });

            const data = await res.json();

            if(!res.ok) {
                setError(data.message || "Signin failed");
                return;
            }
            console.log("Signin success",data);
            localStorage.setItem("token", data.token);
            router.replace("/companies");
        } catch (err) {
            setError("Something went wrong");
        }finally {
            setLoading(false);
        }

    }

    return (
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-neutral-900">Sign in</h1>
                <p className="mt-2 text-sm text-neutral-900">Enter your email and password to continue</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
                        <input type="email"
                            id="email"
                            autoComplete="email"
                            placeholder="you@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-neutral-950 rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                            required />    
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className=" block text-sm font-medium text-neutral-700">
                        Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-neutral-950  rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                            required
                        />
                    </div>
                    {error ? (
                        <p className="text-sm text-red-600">{error}</p>
                    ):null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-800 disabled:opacity-50"
                    >{loading ? "Signing in..." : "Sign in"}</button>
                </form>

            </div>

        </main>
    )
}