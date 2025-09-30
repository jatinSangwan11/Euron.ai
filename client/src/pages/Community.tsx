import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

type CreationDataType = {
  content: string;
  created_at: string;
  id: number;
  likes: string[];
  prompt: string;
  publish: boolean;
  type: string;
  updated_at: string;
  user_id: string;
};

const Community = () => {
  const [creations, setCreations] = useState<CreationDataType[]>([]);
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      console.log(data);
      if (data.success) {
        setCreations(data.creations);
        console.log("creations::", creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error!!!");
    }
    setLoading(false);
  };

  const imageLikeToogle = async (id: number) => {
    try {
      const { data } = await axios.post(
        "/api/user/toogle-like-creation",
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error!!!");
    }
  };
  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Creations</h1>

      <div className="bg-white h-full w-full rounded-2xl shadow-sm p-4 overflow-y-auto">
        {/* Responsive grid instead of inline-block rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creations.map((creation, index) => (
            <div
              key={index}
              className="group rounded-xl overflow-hidden bg-white shadow-sm border border-black/5 transition hover:shadow-md"
            >
              {/* Image wrapper */}
              <div className="relative w-full flex-shrink-0 h-64">
                {/* Use aspect ratio for consistent cards; switch to object-contain if needed */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
                  <img
                    src={creation.content}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Likes (top-right) */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-2
                         rounded-full bg-white/95 px-3 py-1 shadow-md backdrop-blur-sm
                         ring-1 ring-black/5 transition-all group-hover:shadow-lg"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {creation.likes.length}
                  </p>
                  <Heart
                    onClick={() => imageLikeToogle(creation.id)}
                    className={`min-w-5 h-5 transition-transform duration-150 cursor-pointer
                  ${
                    user?.id && creation.likes.includes(user.id)
                      ? "fill-red-500 text-red-600 scale-110"
                      : "text-gray-600 hover:scale-110 hover:text-red-500"
                  }`}
                    aria-label="Like"
                    role="button"
                  />
                </div>

                {/* Prompt (bottom overlay) */}
                <div
                  className="absolute inset-x-0 bottom-0 px-4 py-3
                            bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                >
                  <p className="text-sm font-medium text-white drop-shadow-sm line-clamp-2">
                    {creation.prompt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {creations.length === 0 && (
          <div className="h-full grid place-items-center py-16 text-center text-gray-500">
            <div>
              <p className="text-lg font-medium">No creations yet</p>
              <p className="text-sm">
                Generate something and it’ll show up here ✨
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
