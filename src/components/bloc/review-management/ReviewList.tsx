import { api } from "@/utils/api";
import { Star } from "lucide-react";
import React from "react";

interface ReviewListProps {
  garageId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ garageId }) => {
  const { data: reviews = [], isLoading } = api.review.getByGarage.useQuery({
    garageId,
  });

  if (isLoading) return <div>Chargement des avis...</div>;
  if (reviews.length === 0)
    return <p className="text-muted-foreground">Aucun avis.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {[...Array<number>(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Number(review.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-400"}`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-xs">
              {new Date(review.date).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <p className="text-foreground mt-2">{review.comment}</p>
          <p className="mt-1 text-sm font-medium text-(--accent-gold)">
            — {review.user.name}
          </p>
        </div>
      ))}
    </div>
  );
};
