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
import {
  createReviewSchema,
  type createReviewSchemaType,
} from "@/validation/review/reviewSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  } = useForm<createReviewSchemaType>({
    resolver: zodResolver(createReviewSchema),
  });

  const createReview = api.review.create.useMutation({
    onSuccess: async () => {
      toast.success("Avis ajouté!");
      await utils.review.invalidate();
      reset();
      setRating(0);
      setOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = (data: createReviewSchemaType) => {
    createReview.mutate({ ...data, garageId, rating: rating.toString() });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Star className="h-4 w-4" /> Laisser un avis
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-car rounded-xl border border-[rgba(212,175,55,0.3)]">
        <DialogHeader>
          <DialogTitle className="text-xl text-yellow-500">
            Avis pour {garageName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
              >
                <Star className="h-8 w-8 fill-current" />
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Votre commentaire..."
            className="bg-card-car border-[rgba(212,175,55,0.3)]"
            {...register("comment")}
          />
          {errors.comment && (
            <p className="text-xs text-red-500">{errors.comment.message}</p>
          )}
          <Button
            type="submit"
            disabled={createReview.isPending || rating === 0}
            className="w-full bg-linear-to-r from-yellow-500 to-yellow-400 text-black"
          >
            {createReview.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              "Publier"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
