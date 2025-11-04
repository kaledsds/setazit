// src/components/review/ReviewList.tsx
import { api } from "@/utils/api";
import { Star } from "lucide-react";
import Image from "next/image";

interface ReviewListProps {
  garageId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ garageId }) => {
  const { data: reviews = [], isLoading } = api.review.getByGarage.useQuery(
    { garageId },
    { refetchOnWindowFocus: false },
  );

  if (isLoading)
    return <div className="py-8 text-center">Chargement des avis...</div>;
  if (reviews.length === 0)
    return (
      <div className="text-muted-foreground py-12 text-center">
        <Star className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p>Aucun avis pour le moment</p>
        <p className="mt-2 text-sm">Soyez le premier à laisser un avis !</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-card-car/70 rounded-xl border border-[rgba(212,175,55,0.3)] p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <Image
              src={review.user.image ?? "/avatar.png"}
              alt={review.user.name ?? ""}
              width={44}
              height={44}
              className="rounded-full border-2 border-[rgba(212,175,55,0.3)]"
            />

            <div className="flex-1">
              {/* Stars + Date */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array<number>(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-xs">
                  {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Comment */}
              <p className="text-foreground leading-relaxed">
                {review.comment}
              </p>

              {/* User Name */}
              <p className="mt-3 text-sm font-semibold text-(--accent-gold)">
                — {review.user.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
