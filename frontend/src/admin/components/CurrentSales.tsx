import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { ordersApi } from "../services/ordersService";

export const CurrentSales: React.FC = () => {
    const [chartData, setChartData] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await ordersApi.list();
                const totalPrice = orders.reduce((sum, order) => sum + Number(order.total_price) || 0, 0);
                const delieveredPrice = orders.filter((order) => order.status === "DELIVERED").reduce((sum, order) => sum + Number(order.total_price) || 0, 0);
                console.log("TotalPrice:", totalPrice, "DeliveredPrice:", delieveredPrice);
                setChartData(delieveredPrice / totalPrice * 100);
            } catch (error) {
                console.error("Error fetching orders data:", error);
            }
        };

        fetchData();
    }, []);

    //make a radial bar chart that shows the percentage of sales that have been delivered
    const chartOptions: ApexOptions = {
        chart: {
            id: "current-sales-chart",
            toolbar: { show: false },
            fontFamily: 'Outfit, sans-serif',
        },
        plotOptions: {
            radialBar: {
                hollow: { size: "80%" },
                startAngle: -90,
                endAngle: 90,
                dataLabels: {
                    name: { show: false },
                    value: {
                        fontSize: "36px",
                        fontWeight: "bold",
                        offsetY: -50,
                        color: "#111827",
                        formatter: (val) => `${val.toFixed(2)}%`,
                    },
                },
            },
        },
        fill: {
            colors: ["#4ade80"],
        },
        stroke: {
            lineCap: "round",
        },
    };

    return (
        <div className="bg-gray-100 shadow rounded-lg hover:shadow-md transition">
            <div className="mb-4 bg-white p-4 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Current Sales</h2>
                <p className="text-gray-500 mb-4">Percentage of sales that have been delivered</p>
                <Chart
                    options={chartOptions}
                    series={[chartData]}
                    type="radialBar"
                    height="400px"
                />
            </div>
            <div>
                
            </div>

        </div>
    );
};