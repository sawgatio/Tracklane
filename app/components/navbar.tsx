import React from "react";
import Link from "next/link";

export const Navbar = () => {
    return(
        <nav className="flex items-center justify-between py-6">
            <Link href="/" className="text-lg font-semibold">
                Job Tracker
            </Link>

            <div className="flex items-center gap-4 text-sm">
                <Link href="/">Home</Link>
                <Link href="/companies">Companies</Link>
                <Link href="/signin">Signin</Link>
                <Link href="/signup">Signup</Link>
            </div>
        </nav>
    );
};