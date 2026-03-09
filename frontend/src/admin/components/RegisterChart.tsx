import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { userApi } from "../services/userService";


//make a chart that shows the number of users created day by day for the last 7 days
export const RegisterChart: React.FC = () => {
    const [chartData, setChartData] = useState<{ date: string; count: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await userApi.list();
                const today = new Date();
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    return date.toISOString().split("T")[0];
                }).reverse();


                const userCountsByDate: { [key: string]: number } = {};
                users.forEach(user => {
                    const dateKey = user.createdAt.split("T")[0];
                    userCountsByDate[dateKey] = (userCountsByDate[dateKey] || 0) + 1;
                });


                const data = last7Days.map((date) => ({
                    date,
                    count: userCountsByDate[date] || 0,
                }));


                setChartData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, []);

    const chartOptions: ApexOptions = {
        chart: {
            id: "registrations-chart",
            toolbar: { show: false },
            fontFamily: 'Outfit, sans-serif'
        },
        xaxis: {
            categories: chartData.map((item) => item.date),
            labels: {
                rotate: -45,
                style: { colors: '#64748b' }
            }
        },
        yaxis: {
            forceNiceScale: true,
            labels: {
                formatter: (val) => Math.floor(val).toString(), 
            }
        },
        tooltip: {
            theme: 'light',
            x: { format: 'dd MMM' } 
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '30%',
                distributed: true,
            }
        },
        colors: ['#3b82f6'],
        dataLabels: { enabled: false }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-medium text-gray-700 mb-4">User Registrations (Last 7 Days)</h2>
            <Chart
                options={chartOptions}
                series={[{
                    name: "Registrations",
                    data: chartData.map((item) => item.count),
                }]}
                type="bar"
                height="100%"
                width="100%"
            />
        </div>
    );
};  