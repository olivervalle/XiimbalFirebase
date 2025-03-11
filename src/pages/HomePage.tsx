import { useState, useEffect } from "react";
import { getBusinesses, getUserFavorites } from "../lib/businessService";
import { Business, BusinessFilter } from "../types/business";
import { useAuth } from "../context/AuthContext";
import BusinessGrid from "../components/business/BusinessGrid";
import InlineBusinessFilter from "../components/business/InlineBusinessFilter";

export default function HomePage() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BusinessFilter>({});

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const data = await getBusinesses(filters);
        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [filters]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      try {
        const favoriteIds = await getUserFavorites(user.uid);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleFilterChange = (newFilters: BusinessFilter) => {
    setFilters(newFilters);
  };

  const handleFavoriteToggle = async () => {
    if (!user) return;

    try {
      const favoriteIds = await getUserFavorites(user.uid);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Error refreshing favorites:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Local Businesses</h1>
        <p className="text-muted-foreground">
          Find and connect with the best businesses in your area
        </p>
      </div>

      <InlineBusinessFilter
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
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
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          emptyMessage={
            filters.searchTerm
              ? "No businesses match your search criteria."
              : "No businesses found. Check back later for updates."
          }
        />
      )}
    </div>
  );
}
