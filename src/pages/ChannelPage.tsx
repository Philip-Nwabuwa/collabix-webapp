import { useParams } from "react-router-dom";

// Channel chat page component
export default function ChannelPage() {
  const { channelId } = useParams();

  return (
    <div className="flex flex-col h-full">
      <h1>Channel</h1>
      <p>Channel ID: {channelId}</p>
    </div>
  );
}
