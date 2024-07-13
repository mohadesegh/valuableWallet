import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import WalletTable from "./component/WalletTable";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="bg-[#23143F] h-screen w-full p-2">
      <Head>
        <title className="text-white">Valuable Wallets</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <WalletTable />
      </main>
    </div>
  );
}
