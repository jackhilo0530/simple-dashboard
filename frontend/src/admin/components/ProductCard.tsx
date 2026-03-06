import { Link } from "react-router-dom";
import { Square } from "lucide-react";
import type { Product } from "../../types";

export default function ProductCard({ product }: { product: Product }) {

    return (
        <tr key={product.id} className='transition hover:bg-gray-50 text-center'>
            <td className='w-14 px-5 py-4 text-left whitespace-nowrap'>
                <label className='cursor-pointer text-sm font-medium text-gray-700 select-none'>
                    <input className='sr-only' type="checkbox" />
                    <span className='flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] bg-transparent border-gray-300'>
                        <span className='opacity-0'>
                            <Square />
                        </span>
                    </span>
                </label>
            </td>
            <td className='px-1 py-4 whitespace-pre-line'>
                <Link to={`/dummyProducts/${product.id}`} className="product-link">
                    <div className='flex items-center gap-3 text-gray-700'>
                        <div className='h-12 w-12'>
                            {product.images ? (
                                <img
                                    src={product.images[0]}
                                    alt=""
                                    className='h-15 w-15 rounded-md'
                                />
                            ) : (
                                <span>-</span>
                            )}
                        </div>
                        <span>{product.title}</span>
                    </div>
                </Link>
            </td>
            <td className='px-1 py-4 whitespace-pre-line text-left'>{product.description}</td>
            <td className='px-1 py-4 whitespace-nowrap'>{product.price}</td>
            <td className='px-1 py-4 whitespace-nowrap'>{product.category}</td>
        </tr>
    )
}