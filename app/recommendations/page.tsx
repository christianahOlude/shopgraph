"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    score: number;
};

export default function RecommendationsPage() {
    const [customerId, setCustomerId] = useState("C001");
    const [searchCustomer, setSearchCustomer] = useState("C001");

    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `/api/recommendations?customerId=${searchCustomer}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch recommendations");
                }

                const data = await response.json();

                setRecommendations(data.recommendations);
            } catch (error) {
                console.error(error);
                setError("Unable to load recommendations. Please try again.");
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [searchCustomer]);

    function handleCustomerSubmit(event: React.FormEvent) {
        event.preventDefault();

        const trimmedId = customerId.trim();

        if (!trimmedId) {
            setError("Please enter a customer ID.");
            return;
        }

        setSearchCustomer(trimmedId);
    }

    return (
        <main className="min-h-screen bg-red-50 px-6 py-12">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        ShopGraph
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        Product Recommendations
                    </h1>

                    <p className="mt-2 max-w-2xl text-gray-600">
                        Discover products based on the purchasing patterns of customers
                        with similar interests.
                    </p>
                </header>

                <form
                    onSubmit={handleCustomerSubmit}
                    className="mb-10 flex max-w-xl flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="text"
                        value={customerId}
                        onChange={(event) => setCustomerId(event.target.value)}
                        placeholder="Enter customer ID e.g. C001"
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
                    >
                        Get Recommendations
                    </button>
                </form>

                {loading && (
                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                        <p className="text-gray-500">
                            Finding recommendations for customer {searchCustomer}...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && recommendations.length === 0 && (
                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            No recommendations found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Try another customer ID.
                        </p>
                    </div>
                )}

                {!loading && !error && recommendations.length > 0 && (
                    <>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Recommendations for {searchCustomer}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Based on similar customers&apos; purchase history.
                            </p>
                        </div>

                        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {recommendations.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}