import { useParams } from "react-router-dom";

// Direct message chat page component
export default function DirectMessagePage() {
  const { userId } = useParams();

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 p-4 bg-white">
        <h2 className="text-xl font-semibold">#{userId || "general"}</h2>
        <p className="text-sm text-gray-600">Channel description</p>
      </div>
    </div>
  );
}
