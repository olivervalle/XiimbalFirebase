import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { MapPin } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <div className="max-w-md mx-auto">
        <MapPin className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
