import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFavoriteBusinesses } from "../lib/businessService";
import { Business } from "../types/business";
import { useAuth } from "../context/AuthContext";
import BusinessGrid from "../components/business/BusinessGrid";
import { Button } from "../components/ui/button";
import { Heart } from "lucide-react";
import AuthModal from "../components/auth/AuthModal";

export default function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getFavoriteBusinesses(user.uid);
        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching favorite businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleFavoriteToggle = async () => {
    if (!user) return;

    try {
      const data = await getFavoriteBusinesses(user.uid);
      setBusinesses(data);
    } catch (error) {
      console.error("Error refreshing favorites:", error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">
            Sign in to view your favorites
          </h1>
          <p className="text-muted-foreground mb-8">
            Create an account or sign in to save your favorite businesses and
            access them from any device.
          </p>
          <Button onClick={() => setIsAuthModalOpen(true)}>Sign In</Button>
          <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
          <p className="text-muted-foreground">
            Businesses you've saved for quick access
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate("/")}>
          Explore More Businesses
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48 mb-3"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <BusinessGrid
          businesses={businesses}
          favorites={businesses.map((b) => b.id)}
          onFavoriteToggle={handleFavoriteToggle}
          emptyMessage="You haven't saved any businesses yet. Explore the directory and save your favorites!"
        />
      )}
    </div>
  );
}
