"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { createShopSchema } from "@/validation/shop/shopSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShoppingCart } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateShopModalProps {
  partId: string;
  partName: string;
}

export const CreateShopModal = ({ partId, partName }: CreateShopModalProps) => {
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const { handleSubmit } = useForm({
    resolver: zodResolver(createShopSchema),
    defaultValues: { partId },
  });

  const createShop = api.shop.create.useMutation({
    onSuccess: async () => {
      toast.success("Pièce commandée avec succès !");
      await utils.shop.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la commande");
    },
  });

  const onSubmit = () => {
    createShop.mutate({ partId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-green-400 px-4 py-2 text-white shadow-md transition hover:scale-105">
          <ShoppingCart className="h-4 w-4" />
          <span>Commander</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-car rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-500">
            Confirmer la commande
          </DialogTitle>
        </DialogHeader>
        <div className="text-foreground py-4">
          <p>
            Voulez-vous commander la pièce{" "}
            <span className="font-semibold text-(--accent-gold)">
              {partName}
            </span>{" "}
            ?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={createShop.isPending}
            className="bg-green-500 hover:bg-green-600"
          >
            {createShop.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                En cours...
              </>
            ) : (
              "Confirmer"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
