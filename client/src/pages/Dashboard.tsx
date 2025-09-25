import { useEffect, useState } from "react";
import { dummyCreationData } from "../Assets/assets";
import { Gem, Sparkles } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";

export type creationData = {
  id: number;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish: boolean;
  likes: never[];
  created_at: string;
  updated_at: string;
};
const Dashboard = () => {
  const [creations, setCreations] = useState<creationData[]>([]);

  const getDashboardData = async () => {
    setCreations(dummyCreationData);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total creations card */}
        <div
          className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl
        border border-gray-200"
        >
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588f2] to-[#0BB0D7]
          text-white flex justify-center items-center"
          >
            <Sparkles className="w-5 text-white" />
          </div>
        </div>
        {/* Active plan card */}
        <div
          className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl
        border border-gray-200"
        >
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE]
          text-white flex justify-center items-center"
          >
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>
        {creations.map((item) => (
          <CreationItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
