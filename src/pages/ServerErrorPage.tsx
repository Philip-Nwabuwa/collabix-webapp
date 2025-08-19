import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ServerErrorPage() {
  return (
    <main className="h-screen w-full flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-3xl text-muted-foreground">500</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-2 text-muted-foreground">
          An unexpected error occurred. Please try again or return to a safe
          page.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/workspaces">Go to Workspaces</Link>
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    </main>
  );
}
