import React from 'react';
import { EcommerceMetrics } from '../components/EcommerceMetrics';
import { RegisterChart } from '../components/RegisterChart';
import { CurrentSales } from '../components/CurrentSales';


const Dashboard: React.FC = () => {
    return (
        <>
            <div className='min-h-screen p-10'>
                <h1 className='text-3xl font-bold tracking-tight text-gray-900 mb-6'>Dashboard</h1>
                <div className='grid grid-cols-12 gap-6'>
                    <div className='col-span-7 space-y-6'>
                        <EcommerceMetrics />
                        <RegisterChart />
                    </div>

                    <div className='col-span-5'>
                        <CurrentSales />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;