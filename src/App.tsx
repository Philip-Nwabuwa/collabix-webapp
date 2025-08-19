import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Routes, Route, Navigate } from "react-router-dom";
import { queryClient, ReactQueryDevtools } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import WorkspaceSelectionPage from "@/pages/WorkspaceSelectionPage";
import ChatLayout from "@/pages/ChatLayout";
import ChannelPage from "@/pages/ChannelPage";
import DirectMessagePage from "@/pages/DirectMessagePage";
import NotFoundPage from "@/pages/NotFoundPage";
import ServerErrorPage from "@/pages/ServerErrorPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route
            path="/workspaces"
            element={
              <ProtectedRoute>
                <WorkspaceSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/w/:workspaceId"
            element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="c/:channelId"
              element={
                <ProtectedRoute>
                  <ChannelPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="d/:userId"
              element={
                <ProtectedRoute>
                  <DirectMessagePage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/" element={<Navigate to="/workspaces" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      <Toaster position="top-right" richColors closeButton duration={3000} />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
