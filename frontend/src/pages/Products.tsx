import React from 'react';
import { ChevronRight, Plus, Search, SlidersHorizontal, MoveLeft, MoveRight } from 'lucide-react';

const Products: React.FC = () => {
    return (
        <div className='p-6 pb-24 mx-auto max-w-(--breakpoint-2xl)'>
            <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
                <h2 className='text-xl font-semibold text-gray-800' x-text="pageNamge">Product List</h2>
                <nav>
                    <ol className='flex items-center gap-1.5'>
                        <li>
                            <a href="/" className='inline-flex items-center gap-1.5 text-sm text-gray-500' data-discover="true">
                                Home
                                <ChevronRight width="17" height="16" />
                            </a>
                        </li>
                        <li className='text-sm text-gray-800'>Product List</li>
                    </ol>
                </nav>
            </div>
            <div className='rounded-xl border border-gray-200 bg-white'>
                <div className='flex flex-row items-center justify-between gap-5 border-b border-gray-200 px-5 py-4'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-800'>Products List</h3>
                        <p className='text-sm text-gray-500'>Track your store's progress to boost your sales.</p>
                    </div>
                    <div>
                        <a href="/products" className='bg-brand-500 shadow-sm hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600'>
                            <Plus />
                            Add Product
                        </a>
                    </div>
                </div>
                <div className='border-b border-gray-200 px-5 py-4'>
                    <div className='flex gap-3 justify-between'>
                        <div className='relative flex-auto'>
                            <span className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-500'>
                                <Search width="20" height="20" viewBox="0 0 20 20"/>
                            </span>
                            <input type="text" placeholder='Search...' className='shadow-sm focus:border-brand-300 focus:ring-brand-500/10 h-11 w-[300px] rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-tray-400 focus:ring-3 focus:outline-none'/>
                        </div>
                        <div className='relative'>
                            <button className='flex items-center shadow-theme-xs h-11 justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 w-auto min-w-[100px]'>
                                <SlidersHorizontal width="15" height="15" fill="none" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
                <div className='flex w-full h-[300px]'></div>
                <div className='flex items-center flex-row justify-between border-t border-gray-200 px-5'>
                    <div className='pb-0'>
                        <span className='block text-sm font-medium text-gray-500'>
                            Showing
                            <span className='text-gray-800 px-1'>1</span>
                            to
                            <span className='text-gray-800 px-1'>7</span>
                            of
                            <span className='text-gray-800 px-1'>20</span>
                        </span>
                    </div>
                    <div className='flex w-auto items-center justify-normal gap-2 rounded-none bg-transparent p-0'>
                        <button disabled className='shadow-sm flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50'>
                            <span>
                                <MoveLeft size={20} />
                            </span>
                        </button>
                        <ul className='flex items-center gap-0.5'>
                            <li>
                                <a href="#" className='flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium bg-brand-500 text-white'>
                                    <span>1</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className='flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-medium text-gray-700'>
                                    <span>2</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className='flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-medium text-gray-700'>
                                    <span>3</span>
                                </a>
                            </li>
                        </ul>
                        <button disabled className='shadow-sm flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50'>
                            <span>
                                <MoveRight size={20} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products;