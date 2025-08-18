import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient, ReactQueryDevtools } from "@/lib/queryClient";
import LoginPage from "@/pages/LoginPage";
import ChatLayout from "@/pages/ChatLayout";
import ChannelPage from "@/pages/ChannelPage";
import DirectMessagePage from "@/pages/DirectMessagePage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={<ChatLayout />}>
            <Route path="channels/:channelId" element={<ChannelPage />} />
            <Route path="dm/:userId" element={<DirectMessagePage />} />
          </Route>
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
