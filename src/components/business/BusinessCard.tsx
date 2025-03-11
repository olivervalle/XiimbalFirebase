import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Business } from "../../types/business";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useAuth } from "../../context/AuthContext";
import { addToFavorites, removeFromFavorites } from "../../lib/businessService";
import { AspectRatio } from "../ui/aspect-ratio";

interface BusinessCardProps {
  business: Business;
  isFavorite?: boolean;
  favoriteId?: string;
  onFavoriteToggle?: () => void;
}

export default function BusinessCard({
  business,
  isFavorite = false,
  favoriteId,
  onFavoriteToggle,
}: BusinessCardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    setIsLoading(true);

    try {
      if (favorite && favoriteId) {
        await removeFromFavorites(favoriteId);
      } else {
        const newFavoriteId = await addToFavorites(user.uid, business.id);
        // Store the new favorite ID locally
        console.log("Added favorite with ID:", newFavoriteId);
      }

      setFavorite(!favorite);
      if (onFavoriteToggle) onFavoriteToggle();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/business/${business.id}`} className="block">
        <AspectRatio ratio={16 / 9}>
          <img
            src={
              business.logo ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${business.name}`
            }
            alt={business.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>

        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg truncate">
                {business.name}
              </h3>
              <Badge variant="secondary" className="mt-1">
                {business.category}
              </Badge>
            </div>

            <div className="flex items-center bg-primary-foreground text-primary font-medium rounded-full px-2 py-1 text-sm">
              <span>★</span>
              <span className="ml-1">{business.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
            {business.description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between">
          <span className="text-sm text-muted-foreground">
            {business.city}, {business.state}
          </span>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleFavoriteToggle}
              disabled={isLoading}
            >
              <Heart
                className={`h-5 w-5 ${favorite ? "fill-destructive text-destructive" : ""}`}
              />
            </Button>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}
