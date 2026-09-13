import { z } from "zod";

export const updateDeliveryPositionSchema = z.object({
  delivery_id: z.string().min(1, "ID de livraison requis"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const updateDeliveryStatusSchema = z.object({
  delivery_id: z.string().min(1, "ID de livraison requis"),
  statut: z.enum([
    "assignee",
    "en_route_restaurant",
    "recuperee",
    "en_route_client",
    "livree",
  ]),
});

export type UpdateDeliveryPositionInput = z.infer<
  typeof updateDeliveryPositionSchema
>;
export type UpdateDeliveryStatusInput = z.infer<
  typeof updateDeliveryStatusSchema
>;
