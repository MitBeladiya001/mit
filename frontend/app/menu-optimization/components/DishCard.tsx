import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Dish } from "../types";

interface DishCardProps {
  dish: Dish;
  isSelected: boolean;
  onSelect: (dishId: string) => void;
}

export function DishCard({ dish, isSelected, onSelect }: DishCardProps) {
  return (
    <Card
      className={`relative cursor-pointer transition-all ${
        isSelected
          ? "bg-purple-900/20 border-purple-500"
          : "bg-gray-800 border-gray-700 hover:border-purple-500/50"
      }`}
      onClick={() => onSelect(dish._id)}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={dish.photo}
          alt={dish.name}
          className="h-full w-full object-cover"
        />
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-500/20">
            <Check className="h-8 w-8 text-purple-500" />
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg text-white">{dish.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-gray-400">
          <p>${dish.price?.toFixed(2) || "0.00"}</p>
          <p className="mt-1">
            {dish.ingredients.length} ingredients
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 