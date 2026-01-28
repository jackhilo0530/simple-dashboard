import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { productApi } from "../services/dataService";

const Product: React.FC = () => {
    const { id } = useParams();
    const productId = Number(id);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                if (!Number.isFinite(productId)) throw new Error("invalid product id");
                const p = await productApi.getProduct(productId);
                setProduct(p);
            } catch (e: any) {
                setError(e?.message ?? "failed to load product");
            } finally {
                setLoading(false);
            }
        })();
    }, [productId]);

    if (loading) return <p className="muted">loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!product) return <p className="muted">not found</p>;

    return (
        <section className="grid gap-0.75">
            <div>
                <Link to="/products" className="inline-flex gap-2 px-1 py-3 mt-4 ml-3 mb-2 text-lg text-gray-800 text-center font-medium rounded-lg bg-gray-300 shadow-xs w-20">← back</Link>
                <div className='flex flex-row gap-6 items-center rounded-x1 border border-gray-200 bg-white p-6'>
                    <div className='overflow-hidden rounded-lg'>
                        <img className="overflow-hidden rounded-lg max-w-full max-h-[340px]" src={product.images} alt="" />
                    </div>
                    <div>
                        <h2 className='mb-1 text-2xl font-medium text-gray-700'>{product.title}</h2>
                        <p className='text-lg px-3 text-gray-500'>{product.description}</p>
                        <p className='mt-3 px-3'>{product.category}</p>
                        <p className='text-xl px-3 font-medium mt-3'>{product.price}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Product;