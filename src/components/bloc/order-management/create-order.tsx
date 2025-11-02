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
import {
  createOrderSchema,
  type createOrderSchemaType,
} from "@/validation/order/orderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShoppingCart } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateOrderModalProps {
  carId: string;
  carName: string;
}

export const CreateOrderModal = ({ carId, carName }: CreateOrderModalProps) => {
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const { handleSubmit } = useForm<createOrderSchemaType>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { carId },
  });

  const createOrder = api.order.create.useMutation({
    onSuccess: async () => {
      toast.success("Commande créée avec succès!");
      await utils.order.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });

  const onSubmit = () => {
    createOrder.mutate({ carId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 rounded-full bg-linear-to-r from-(--accent-gold) to-(--accent-gold-light) px-4 py-2 text-center font-semibold text-black transition-transform hover:-translate-y-1">
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
            Voulez-vous commander{" "}
            <span className="font-semibold text-yellow-500">{carName}</span> ?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={createOrder.isPending}
            className="bg-green-500 hover:bg-green-600"
          >
            {createOrder.isPending ? (
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
