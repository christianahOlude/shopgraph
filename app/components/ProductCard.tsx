type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    score: number;
};

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-start justify-between gp-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        {product.id}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-gray-900">
                        {product.name}
                    </h2>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    ★ {product.rating}
                </span>
            </div>

            <p className="min-h-12 text-sm leading-6 text-gray-600">
                {product.description}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-lg font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                </span>

                <span className="text-sm text-gray-500">
                    Recommended by {product.score} similar{" "}
                    {product.score === 1 ? "customer" : "customers"}
                </span>
            </div>
        </article>
    );
}