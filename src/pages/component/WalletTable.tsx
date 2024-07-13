import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
export interface Wallet {
  walletAddress: string;
  netProfit: string; 
}

const WalletTable: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isSortedAsc, setIsSortedAsc] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://onchain.dextrading.com/valuable_wallets?network=eth&page=${page}&limit=5`
      );
      const data = await response.json();
      const sortedData = data.sort((a: Wallet, b: Wallet) =>
        isSortedAsc
          ? parseFloat(a.netProfit) - parseFloat(b.netProfit)
          : parseFloat(b.netProfit) - parseFloat(a.netProfit)
      );
      setWallets(sortedData);
    };
    fetchData();
  }, [page, isSortedAsc]);

  const sortTable = (): void => {
    setIsSortedAsc(!isSortedAsc);
  };
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center w-full mt-10 bg-[#31313B] rounded-md p-2 sm:p-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-[#5B738E]">
        Valuable Wallets
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="table-auto min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-white">Wallet Address</th>
              <th
                className="px-4 py-2 cursor-pointer text-white"
                onClick={sortTable}
              >
                Net Profit {isSortedAsc ? "🔼" : "🔽"}
              </th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td
                  className="border px-4 py-2 text-white"
                  onClick={() => router.push(`/wallet/${wallet.walletAddress}`)}
                >
                  {wallet.walletAddress}
                </td>
                <td className="border px-4 py-2 text-white">
                  {wallet.netProfit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between max-w-xs mx-auto mt-4 w-full">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-sm sm:text-base md:py-4 md:px-8"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-sm sm:text-base md:py-4 md:px-8"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WalletTable;
