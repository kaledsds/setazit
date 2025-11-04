// src/components/modals/CreateReviewModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// 1. UPDATE SCHEMA TO INCLUDE RATING
const createReviewSchema = z.object({
  comment: z.string().min(10, "Minimum 10 caractères"),
  rating: z.number().min(1).max(5),
});

type CreateReviewInput = z.infer<typeof createReviewSchema>;

interface CreateReviewModalProps {
  garageId: string;
  garageName: string;
}

export const CreateReviewModal = ({
  garageId,
  garageName,
}: CreateReviewModalProps) => {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
  });

  // 2. RESET FORM WHEN MODAL OPENS
  React.useEffect(() => {
    if (open) {
      setRating(0);
      reset();
    }
  }, [open, reset]);

  const createReview = api.review.create.useMutation({
    onSuccess: async () => {
      toast.success("Avis publié avec succès !");
      await utils.review.invalidate();
      setOpen(false);
    },
    onError: (err) => toast.error(err.message || "Erreur"),
  });

  const onSubmit = (data: CreateReviewInput) => {
    createReview.mutate({
      ...data,
      garageId,
      rating, // now included
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Laisser un avis
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card-car rounded-xl border border-[rgba(212,175,55,0.3)] shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-yellow-500">
            Avis pour {garageName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* STAR RATING */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setValue("rating", star); // sync with form
                }}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    rating >= star
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-400"
                  }`}
                />
              </Button>
            ))}
          </div>
          {rating === 0 && open && (
            <p className="text-center text-xs text-red-400">
              Choisissez une note
            </p>
          )}

          {/* COMMENT */}
          <Textarea
            placeholder="Partagez votre expérience..."
            className="bg-card-car text-foreground placeholder:text-muted-foreground min-h-24 border-[rgba(212,175,55,0.3)]"
            {...register("comment")}
          />
          {errors.comment && (
            <p className="text-xs text-red-500">{errors.comment.message}</p>
          )}

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={createReview.isPending || rating === 0}
            className="w-full bg-linear-to-r from-yellow-500 to-yellow-400 font-bold text-black hover:from-yellow-600 hover:to-yellow-500"
          >
            {createReview.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              "Publier l'avis"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
