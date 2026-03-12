import React from 'react';
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { productApi } from '../services/dataService';
import type { ShopProduct } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const ShopProduct: React.FC = () => {
    const { id } = useParams();
    const productId = Number(id);
    const [product, setProduct] = useState<ShopProduct | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setError(null);
                const data = await productApi.getProductById(productId);
                setProduct(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>No product found</div>;

    return (
        <div className="min-h-screen py-12 bg-slate-50/50 antialiased bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className='overflow-hidden rounded-[2.5rem] border border-white bg-white/70 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] backdrop-blur-xl'>
                    <div className='grid grid-cols-12'>

                        <div className='relative col-span-7'>
                            <div className='aspect-square w-full overflow-hidden bg-slate-100 p-8 lg:aspect-auto lg:h-full'>
                                <img src={`${API_BASE_URL}${product.img_url}`} alt={product.name}
                                    className='h-full w-full rounded-3xl object-cover shadow-2xl transition-transform duration-300 hover:scale-105' />
                            </div>
                            <div className='absolute left-10 top-10'>
                                <span className='inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md'>
                                    <span className={`mr-2 h-2 w-2 rounded-full ${product.stock_quantity > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <div className='flex flex-col p-16 col-span-5'>
                            <div className='mb-auto'>
                                <div className="mb-4 inline-block rounded-lg bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-indigo-600">
                                    {product.sku}
                                </div>

                                <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                    {product.name}
                                </h1>

                                <div className="mt-6 flex items-baseline gap-4">
                                    <span className="text-4xl font-bold text-green-600">${product.complete_at_price}</span>
                                    {product.price && (
                                        <span className="text-lg text-slate-400 line-through decoration-slate-300 decoration-2">
                                            ${product.price}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-8 space-y-6">
                                    <div className="prose prose-slate prose-sm leading-relaxed text-slate-600">
                                        {product.description}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2">
                                <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/30">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Inventory</p>
                                        <span className="text-xs font-black text-slate-900">{product.stock_quantity}</span>
                                    </div>

                                    <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-200/50 shadow-inner">
                                        <div className="bg-gradient-to-r h-full rounded-full from-emerald-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (product.stock_quantity / 100) * 100)}%` }}>
                                        </div>
                                    </div>

                                    <p className="mt-2 text-[10px] italic text-slate-400">
                                        {product.stock_quantity > 50 ? 'Healthy stock levels' : 'Low stock warning'}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/30">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="shadow-xs rounded-lg bg-white p-1.5">
                                            <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-bold text-slate-800">{product.category}  </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col gap-4">
                                <a href="<?php echo site_url('admin/products/edit_product/' . $product['id']); ?>">
                                    <button className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-slate-800 hover:shadow-slate-200 active:scale-95">
                                        Edit Product Details
                                    </button>
                                </a>
                                <Link to="/admin/products">
                                    <button className="w-full bg-white rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50">
                                        Return to List
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default ShopProduct;