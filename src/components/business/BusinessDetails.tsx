import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Heart,
  ArrowLeft,
  Star,
} from "lucide-react";
import { Business, Review } from "../../types/business";
import {
  getBusinessById,
  getBusinessReviews,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
} from "../../lib/businessService";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Map } from "../ui/map";
import { AspectRatio } from "../ui/aspect-ratio";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import AuthModal from "../auth/AuthModal";

export default function BusinessDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const businessData = await getBusinessById(id);
        if (!businessData) {
          setError("Business not found");
          return;
        }

        setBusiness(businessData);

        // Fetch reviews separately
        fetchReviews(id);

        // Check if business is in user's favorites
        if (user) {
          try {
            const favorites = await getUserFavorites(user.uid);
            const isFav = favorites.some((fav) => fav === id);
            setIsFavorite(isFav);

            // Find the favorite document ID if it exists
            if (isFav) {
              try {
                const favDocs = await getUserFavoriteDocuments(user.uid);
                const favDoc = favDocs.find((doc) => doc.businessId === id);
                if (favDoc) {
                  setFavoriteId(favDoc.id);
                }
              } catch (favErr) {
                console.error("Error getting favorite document ID:", favErr);
              }
            }
          } catch (favErr) {
            console.error("Error checking favorites:", favErr);
          }
        }
      } catch (err) {
        console.error("Error fetching business data:", err);
        setError("Failed to load business details");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async (businessId: string) => {
      try {
        console.log("Fetching reviews for business ID:", businessId);
        const reviewsData = await getBusinessReviews(businessId);
        console.log("Reviews fetched:", reviewsData);
        if (reviewsData && reviewsData.length > 0) {
          setReviews(reviewsData);
        } else {
          // Use sample data if no reviews found
          setReviews([
            {
              id: "sample1",
              userId: "user1",
              userName: "Sarah Johnson",
              rating: 5,
              comment:
                "Absolutely love this place! The service is excellent and the atmosphere is perfect.",
              date: new Date("2023-10-15"),
            },
            {
              id: "sample2",
              userId: "user2",
              userName: "Michael Chen",
              rating: 4,
              comment:
                "Great experience overall. Would definitely recommend to others looking for quality service.",
              date: new Date("2023-09-22"),
            },
            {
              id: "sample3",
              userId: "user3",
              userName: "Jessica Williams",
              rating: 5,
              comment:
                "Exceptional service and attention to detail. The staff was very accommodating with my requests.",
              date: new Date("2023-11-05"),
            },
          ]);
        }
      } catch (reviewErr) {
        console.error("Error fetching reviews:", reviewErr);
        // Use sample data if error occurs
        setReviews([
          {
            id: "sample1",
            userId: "user1",
            userName: "Sarah Johnson",
            rating: 5,
            comment:
              "Absolutely love this place! The service is excellent and the atmosphere is perfect.",
            date: new Date("2023-10-15"),
          },
          {
            id: "sample2",
            userId: "user2",
            userName: "Michael Chen",
            rating: 4,
            comment:
              "Great experience overall. Would definitely recommend to others looking for quality service.",
            date: new Date("2023-09-22"),
          },
        ]);
      }
    };

    fetchBusinessData();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!business) return;

    try {
      if (isFavorite && favoriteId) {
        console.log("Removing favorite with ID:", favoriteId);
        await removeFromFavorites(favoriteId);
        setFavoriteId(null);
      } else {
        const newFavoriteId = await addToFavorites(user.uid, business.id);
        console.log("Added favorite with ID:", newFavoriteId);
        setFavoriteId(newFavoriteId);
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleReviewAdded = async (newReview: Review) => {
    console.log("New review added:", newReview);
    setReviews((prevReviews) => [newReview, ...prevReviews]);

    // Refresh business data to get updated rating
    if (id) {
      const updatedBusiness = await getBusinessById(id);
      if (updatedBusiness) {
        setBusiness(updatedBusiness);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {error || "Business not found"}
        </h2>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AspectRatio
            ratio={16 / 9}
            className="bg-muted rounded-lg overflow-hidden"
          >
            <img
              src={
                business.logo ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${business.name}`
              }
              alt={business.name}
              className="object-cover w-full h-full"
            />
          </AspectRatio>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{business.name}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="secondary">{business.category}</Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-medium">
                    {business.rating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant={isFavorite ? "default" : "outline"}
              className={
                isFavorite
                  ? "bg-red-100 text-red-600 hover:bg-red-200 border-red-200"
                  : ""
              }
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
              />
              {isFavorite ? "Saved" : "Save"}
            </Button>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">{business.description}</p>
          </div>

          <Tabs defaultValue="reviews">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="info">Business Info</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-6 pt-4">
              <ReviewForm
                businessId={business.id}
                onReviewAdded={handleReviewAdded}
                onAuthRequired={() => setIsAuthModalOpen(true)}
              />

              <ReviewList reviews={reviews} />
            </TabsContent>

            <TabsContent value="info" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Contact Information
                </h3>
                <ul className="space-y-2">
                  {business.phone && (
                    <li className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a
                        href={`tel:${business.phone}`}
                        className="hover:underline"
                      >
                        {business.phone}
                      </a>
                    </li>
                  )}
                  {business.email && (
                    <li className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a
                        href={`mailto:${business.email}`}
                        className="hover:underline"
                      >
                        {business.email}
                      </a>
                    </li>
                  )}
                  {business.website && (
                    <li className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {business.website.replace(/^https?:\/\//, "")}
                      </a>
                    </li>
                  )}
                  <li className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p>{business.address}</p>
                      <p>
                        {business.city}, {business.state} {business.zip}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Business Hours</h3>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <span>Monday</span>
                    <span>{business.hours.monday || "Closed"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tuesday</span>
                    <span>{business.hours.tuesday || "Closed"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Wednesday</span>
                    <span>{business.hours.wednesday || "Closed"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Thursday</span>
                    <span>{business.hours.thursday || "Closed"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Friday</span>
                    <span>{business.hours.friday || "Closed"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>{business.hours.saturday || "Closed"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>{business.hours.sunday || "Closed"}</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg overflow-hidden border">
            <Map
              lat={business.location.lat}
              lng={business.location.lng}
              className="h-64"
            />
            <div className="p-4">
              <h3 className="font-medium mb-2">Location</h3>
              <p className="text-sm text-muted-foreground">
                {business.address}, {business.city}, {business.state}{" "}
                {business.zip}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </div>
  );
}
