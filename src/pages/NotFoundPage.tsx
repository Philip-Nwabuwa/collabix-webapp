import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const handleRetry = () => {
    window.location.reload();
  };
  return (
    <main className="h-screen w-full flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-3xl text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/workspaces">Go to Workspaces</Link>
          </Button>
          <Button variant="outline" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      </div>
    </main>
  );
}
