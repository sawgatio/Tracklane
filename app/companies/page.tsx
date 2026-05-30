"use client";
import { Container } from "../components/container";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";

type Company = {
    id: string;
    name: string;
    website: string;
  };


export default function CompaniesPage(){
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
    


        
    async function fetchCompanies() {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                router.replace("/signin");
                return;
                }

                const res = await fetch("http://localhost:3000/api/company", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                });

                const text = await res.text();
                const data = text ? JSON.parse(text) : {};

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

        useEffect(() => {

            fetchCompanies();
        }, []);

        const handleAddCompany: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
            e.preventDefault();
            setError("");
            setSuccessMessage("");
            setSubmitLoading(true);

            try {
                const token = localStorage.getItem("token");

                if(!token){
                    router.replace("/signin");
                    return;
                }

                const res = await fetch("http://localhost:3000/api/company", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, website }),
                });

                const text = await res.text();
                const data = text ? JSON.parse(text) : {};

                if(!res.ok){
                    setError(data.message || "Failed to add company");
                    return;
                }
                
                setSuccessMessage("Company added successfully");
                setName("");
                setWebsite("");
                await fetchCompanies();
            }catch {
                setError("Something went wrong while adding company");
              } finally {
                setSubmitLoading(false);
              }
            };
            if (loading) {
                return (
                  <Container>
                    <div className="py-10">Loading companies...</div>
                  </Container>
                );
              }
              if (error && companies.length === 0) {
                return (
                  <Container>
                    <div className="py-10 text-red-600">{error}</div>
                  </Container>
                );
              }
             
        async function handleDeleteCompany(companyId: string){
            setError("");
            setSuccessMessage("");
            setDeleteLoadingId(companyId);

            try{
                const token = localStorage.getItem("token");


                if(!token){
                    router.replace("/signin");
                    return;
                }

                const res = await fetch(`http://localhost:3000/api/company/${companyId}`,{
                    method:"DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const text = await res.text();
                const data = text ? JSON.parse(text) : {};

                if(!res.ok){
                    setError(data.message || "Failed to delete company");
                    return;
                }

                setSuccessMessage("Company deleted successfully");
                await fetchCompanies();
            }catch{
                setError("Something went wrong while deleting company");
            }finally{
                setDeleteLoadingId(null);
            }

        }
        

    return (
        <Container>
            <div className="py-10">
                <h1 className="text-2xl font-bold">Companies</h1>

                <form onSubmit={handleAddCompany} className="mt-6 space-y-4 rounded-lg border p-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Company Name</label>
                        <input type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter company name"
                            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2  outline-none focus:border-neutral-500 text-white" 
                            required/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Website</label>
                        <input type="text"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="Enter company website"
                            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-white outline-none focus:border-neutral-500 "
                            required />
                    </div>

                    {error ? <p className="text-sm text-red-600">{error}</p>:null}
                    {successMessage ? <p className="text-sm text-green-600">{successMessage}</p>:null}
                    <button type="submit"
                        disabled={submitLoading}
                         className="rounded-lg bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-800 disabled:opacity-50">
                            {submitLoading ? "Adding..." : "Add Company"}

                    </button>
                    
                    </form>    


                <div className="mt-6 space-y-4">
                    {companies.map((company) => (
                        <div key={company.id} className="rounded-lg border p-4">
                            <h2 className="font-semibold">{company.name}</h2>
                            <p className="text-sm text-gray-500">{company.website}</p>
                            <button 
                                onClick={() => handleDeleteCompany(company.id)}
                                disabled={deleteLoadingId === company.id}
                                className="rounded-lg bg-red-100 px-4 py-2 text-red-700">
                                    {deleteLoadingId === company.id ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    ))}

                </div>
            </div>
        </Container>
    )
}

