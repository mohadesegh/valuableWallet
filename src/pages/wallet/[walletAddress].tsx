import { useRouter } from "next/router";
import WalletChart from "../component/WalletChart";

const WalletPage = () => {
  const router = useRouter();
  const { walletAddress } = router.query;

  return (
    <div className="bg-[#23143F] w-full h-screen justify-center items-start flex">
      <WalletChart walletAddress={walletAddress as string} />
    </div>
  );
};

export default WalletPage;
