import { Review } from "../../types/business";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  console.log("ReviewList component received reviews:", reviews);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No reviews yet. Be the first to leave a review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Customer Reviews</h3>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>
                  {review.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center">
                  <p className="font-medium">{review.userName}</p>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <p className="text-sm text-muted-foreground">
                    {format(review.date, "MMM d, yyyy")}
                  </p>
                </div>

                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < review.rating ? "text-yellow-500" : "text-muted"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground mt-2">{review.comment}</p>
              </div>
            </div>

            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}
