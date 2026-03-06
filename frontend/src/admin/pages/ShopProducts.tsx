const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { productApi } from '../services/dataService';
import type { ShopProduct } from '../../types';
import SearchForm from '../../components/SearchForm';
import Select from '../../components/Select';


const ShopProducts: React.FC = () => {
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setError(null);
                const data = await productApi.getProducts();
                setProducts(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const onDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        try {
            await productApi.deleteShopProduct(id);
            setProducts(products.filter((product) => product.id !== id));
        } catch (err: any) {
            alert(err.message || "Failed to delete product");
        }
    };

    return (
        <div className='flex-1 p-10 min-h-screen bg-white'>
            <div className='mb-8 flex justify-between gap-4 items-center'>
                <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Shop Products</h1>

                <div className='flex itmes-center gap-3 py-4'>
                    <SearchForm placeholder="Search products..." onSearch={(query) => console.log("Search query:", query)} />
                    <Select options={["All", "Category 1", "Category 2"]} onChange={(value) => console.log("Selected category:", value)} />
                </div>
            </div>

            <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
                <table className='w-full border-collapse border border-gray-200 text-left'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className="border-b border-gray-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Description</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Visibility</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">SKU</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan={5} className='text-center py-4 text-gray-500'>Loading products...</td></tr>}
                        {error && <tr><td colSpan={5} className='text-center py-4 text-red-500'>{error}</td></tr>}
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product.id} className='hover:bg-gray-50'>
                                <td className="border-b border-gray-200 px-6 py-4">
                                    <Link to={`/admin/products/${product.id}`}>
                                        <div className='flex items-center gap-3'>
                                            <img src={product.img_url ? `${API_BASE_URL}${product.img_url}` : "https://via.placeholder.com/40"} alt={product.name} className='h-12 w-12 rounded-lg object-cover' />
                                            <span className='font-medium text-gray-900'>{product.name}</span>
                                        </div>
                                    </Link>
                                </td>
                                <td className="border-b border-gray-200 px-6 py-4">{product.description}</td>
                                <td className="border-b border-gray-200 px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${product.category ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {product.category}
                                    </span>
                                </td>
                                <td className="border-b border-gray-200 px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${product.status == 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className='border-b border-gray-200 px-6 py-4 text-center'>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${product.isDraft == true ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {product.isDraft}
                                    </span>
                                </td>
                                <td className='border-b border-gray-200 px-6 py-4 text-center'>
                                    <code className='bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-mono'>
                                        {product.sku}
                                    </code>
                                </td>
                                <td className="border-b border-gray-200 px-6 py-4 text-center">
                                    <div className='flex flex-col'>
                                        {Number(product.complete_at_price) > 0 ? (
                                            <>
                                                <span className='text-xs text-gray-400' style={{ textDecorationLine: 'line-through' }}>
                                                    ${Number(product.price).toFixed(2)}
                                                </span>
                                                <span className="text-sm font-bold text-green-600">
                                                    ${Number(product.complete_at_price).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm font-bold text-gray-900">
                                                ${Number(product.price).toFixed(2)} 
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="border-b border-gray-200 px-6 py-4 text-center">
                                    <div className='flex flex-col gap-1'>
                                        <div className='h-2 w-full rounded-full bg-gray-200'>
                                            <div className={`h-2 w-full rounded-full ${product.stock_quantity >= 50 ? 'bg-green-500' : product.stock_quantity >= 20 ? 'bg-yellow-500' : 'bg-red-200'}`} style={{ width: `${(product.stock_quantity / 100) * 100}%` }}></div>
                                        </div>
                                        <span className='text-sm text-gray-500'>{product.stock_quantity} in stock</span>
                                    </div>
                                </td>
                                <td className="border-b border-gray-200 px-6 py-4 text-center space-x-2">
                                    <a href="#" className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-600 shadow-sm ring-1 ring-inset ring-amber-500 transition-all hover:bg-amber-50">
                                        Edit
                                    </a>

                                    <button onClick={() => onDelete(product.id)} className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-500 transition-all hover:bg-red-50">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : !loading && <tr><td colSpan={5} className='text-center py-4 text-gray-500'>No products found.</td></tr>}

                    </tbody>

                </table>

            </div>



        </div>
    );
};

export default ShopProducts;