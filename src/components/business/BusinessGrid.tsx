import { Business } from "../../types/business";
import BusinessCard from "./BusinessCard";

interface BusinessGridProps {
  businesses: Business[];
  favorites?: string[];
  onFavoriteToggle?: () => void;
  emptyMessage?: string;
}

export default function BusinessGrid({
  businesses,
  favorites = [],
  onFavoriteToggle,
  emptyMessage = "No businesses found",
}: BusinessGridProps) {
  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          isFavorite={favorites.includes(business.id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}
