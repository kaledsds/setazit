import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { Loader2, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface DeleteReviewModalProps {
  reviewId: string;
  userName: string;
}

export const DeleteReviewModal = ({
  reviewId,
  userName,
}: DeleteReviewModalProps) => {
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const deleteReview = api.review.delete.useMutation({
    onSuccess: async () => {
      toast.success("Avis supprimé avec succès!");
      await utils.review.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  const handleDelete = () => {
    deleteReview.mutate({ id: reviewId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="border-red-500/30 bg-transparent text-red-500 transition hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-car rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-500">
            Confirmer la suppression
          </DialogTitle>
          <p className="text-foreground pt-4">
            Supprimer l&apos;avis de{" "}
            <span className="font-semibold text-yellow-500">{userName}</span> ?
            <br />
            <span className="text-red-400">Action irréversible.</span>
          </p>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteReview.isPending}
            className="border-[rgba(212,175,55,0.3)]"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteReview.isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {deleteReview.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
