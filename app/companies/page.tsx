"use client";
import { Container } from "../components/container";
import { useState,useEffect } from "react";

type Company = {
    id: string;
    name: string;
    website: string;
  };


export default function CompaniesPage(){
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

        useEffect(() => {
            async function fetchCompanies() {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                setError("No token found. Please sign in first.");
                return;
                }

                const res = await fetch("http://localhost:3000/api/company", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                });

                const data = await res.json();

                if (!res.ok) {
                setError(data.message || "Failed to fetch companies");
                return;
                }

                setCompanies(data.companies || []);
            } catch {
                setError("Something went wrong while fetching companies");
            } finally {
                setLoading(false);
            }
            }

            fetchCompanies();
        }, []);
    return (
        <Container>
            <div className="py-10">
                <h1 className="text-2xl font-bold">Companies</h1>

                <div className="mt-6 space-y-4">
                    {companies.map((company) => (
                        <div key={company.id} className="rounded-lg border p-4">
                            <h2 className="font-semibold">{company.name}</h2>
                            <p className="text-sm text-gray-500">{company.website}</p>
                        </div>
                    ))}

                </div>
            </div>
        </Container>
    )
}

