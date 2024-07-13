import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TimeframeData {
  [key: string]: Record<string, number>;
}

interface WalletSummaryData {
  [key: string]: TimeframeData; 
}

interface WalletChartProps {
  walletAddress: string;
}


const WalletChart: React.FC<WalletChartProps> = ({ walletAddress }) => {
  const [data, setData] = useState<WalletSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<string>("totalBuyAmounts"); 
  const [timeFrame, setTimeFrame] = useState<string>("month"); 

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://onchain.dextrading.com/walletsummary/${walletAddress}?network=eth`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [walletAddress]);

  // Chart Data preparation
  const chartData: ChartData<"bar", number[], string> = {
    labels: data
      ? Object.keys(
          data[metric as keyof WalletSummaryData][
            timeFrame as keyof TimeframeData
          ]
        )
      : [],
    datasets: [
      {
        label: `${metric} in ${timeFrame}`,
        data: data
          ? Object.values(
              data[metric as keyof WalletSummaryData][
                timeFrame as keyof TimeframeData
              ]
            )
          : [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        yAxisID: "y-axis-1",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    scales: {
      "y-axis-1": {
        type: "linear",
        position: "left",
        beginAtZero: true,
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <h3 className="text-lg text-[#5B738E] md:text-xl font-bold mb-4">
        Wallet Activity Chart
      </h3>
      <div className="w-full max-w-md px-2">
        <select onChange={(e) => setMetric(e.target.value)}>
          <option value="totalBuyAmounts">Total Buy Amounts</option>
          <option value="totalSellAmounts">Total Sell Amounts</option>
          <option value="totalBuySellTimes">Total Buy/Sell Times</option>
        </select>
        <select onChange={(e) => setTimeFrame(e.target.value)}>
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div className="w-full max-w-5xl">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WalletChart;
