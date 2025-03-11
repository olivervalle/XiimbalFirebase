import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addReview } from "../../lib/businessService";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z
    .string()
    .min(3, "Review must be at least 3 characters")
    .max(500, "Review cannot exceed 500 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  businessId: string;
  onReviewAdded: (review: any) => void;
  onAuthRequired: () => void;
}

export default function ReviewForm({
  businessId,
  onReviewAdded,
  onAuthRequired,
}: ReviewFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setIsLoading(true);

    try {
      const reviewData = {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        rating: data.rating,
        comment: data.comment,
        date: new Date(),
      };

      const reviewId = await addReview(businessId, reviewData);

      onReviewAdded({ id: reviewId, ...reviewData });

      // Reset form
      form.reset();
      setSelectedRating(null);
    } catch (error) {
      console.error("Error adding review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
  };

  if (!user) {
    return (
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <h3 className="font-medium mb-2">Want to leave a review?</h3>
        <p className="text-muted-foreground mb-4">
          Sign in to share your experience with this business
        </p>
        <Button onClick={onAuthRequired}>Sign In to Review</Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-lg p-6">
      <h3 className="font-medium mb-4">Write a Review</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <p className="text-sm font-medium mr-2">Your Rating</p>
              <FormField
                control={form.control}
                name="rating"
                render={() => (
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className={`text-2xl ${selectedRating && rating <= selectedRating ? "text-yellow-500" : "text-muted"}`}
                        onClick={() => handleRatingClick(rating)}
                        disabled={isLoading}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>
            {form.formState.errors.rating && (
              <p className="text-sm text-destructive">Please select a rating</p>
            )}
          </div>

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Share your experience with this business..."
                    className="resize-none"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
