import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react"
import { dummyPublishedCreationData } from "../Assets/assets";
import { Heart } from "lucide-react";

type CreationDataType = {
  id: number;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish: boolean;
  likes: string[];
  created_at: string;
  updated_at: string;
};

const Community = () => {
  const [creations, setCreations] = useState<CreationDataType[]>([]);
  const {user} = useUser();

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData)
  }

  useEffect(() =>{
    if(user){
      fetchCreations();
    }
  },[user]);

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      Creations
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {creations.map((creation, index) => (
          <div key={index} className="relative group inline-block pl-3 pt-3 w-full
          sm:max-w-1/2 lg:max-w-1/3">
            <img src={creation.content} alt="" className="w-full h-full object-cover
            rounded-lg"/>

            <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end
            justify-end group-hover:justify-between p-3 ground-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
              <p className="text-sm group-hover: block">
                {creation.prompt}
              </p>
              <div className="flex gap-1 items-center">
                <p>{creation.likes.length}</p>
                <Heart className={`min-w-5 h-5 hover:scale-110 cursor-pointer
                  ${user?.id && creation.likes.includes(user.id) ? 'fill-red-500 text-red-600' : 'text-white'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community
